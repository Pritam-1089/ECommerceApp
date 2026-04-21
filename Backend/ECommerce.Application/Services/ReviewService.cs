using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using ECommerce.Core.Entities;
using ECommerce.Core.Interfaces;

namespace ECommerce.Application.Services;

public class ReviewService : IReviewService
{
    private readonly IGenericRepository<Review> _reviewRepo;
    private readonly IGenericRepository<Product> _productRepo;
    private readonly IGenericRepository<User> _userRepo;

    public ReviewService(
        IGenericRepository<Review> reviewRepo,
        IGenericRepository<Product> productRepo,
        IGenericRepository<User> userRepo)
    {
        _reviewRepo = reviewRepo;
        _productRepo = productRepo;
        _userRepo = userRepo;
    }

    public async Task<ReviewDto> CreateReviewAsync(CreateReviewDto dto, int userId)
    {
        var products = await _productRepo.FindAsync(p => p.Id == dto.ProductId && p.IsActive);
        if (!products.Any())
            throw new KeyNotFoundException("Product not found.");

        if (dto.Rating < 1 || dto.Rating > 5)
            throw new ArgumentException("Rating must be between 1 and 5.");

        if (string.IsNullOrWhiteSpace(dto.Comment))
            throw new ArgumentException("Comment cannot be empty.");

        var existing = await _reviewRepo.FindAsync(r => r.ProductId == dto.ProductId && r.UserId == userId);
        if (existing.Any())
            throw new InvalidOperationException("You have already reviewed this product.");

        var user = await _userRepo.GetByIdAsync(userId);
        if (user == null)
            throw new KeyNotFoundException("User not found.");

        var review = new Review
        {
            ProductId = dto.ProductId,
            UserId = userId,
            Rating = dto.Rating,
            Comment = dto.Comment,
            CreatedAt = DateTime.UtcNow
        };

        await _reviewRepo.AddAsync(review);

        return new ReviewDto
        {
            Id = review.Id,
            ProductId = review.ProductId,
            UserId = review.UserId,
            UserName = user.FirstName + " " + user.LastName,
            Rating = review.Rating,
            Comment = review.Comment,
            CreatedAt = review.CreatedAt
        };
    }

    public async Task<List<ReviewDto>> GetReviewsByProductIdAsync(int productId)
    {
        var products = await _productRepo.FindAsync(p => p.Id == productId && p.IsActive);
        if (!products.Any())
            throw new KeyNotFoundException("Product not found.");

        var reviews = await _reviewRepo.FindAsync(r => r.ProductId == productId);
        if (!reviews.Any())
            return new List<ReviewDto>();

        var userIds = reviews.Select(r => r.UserId).Distinct().ToList();
        var users = await _userRepo.FindAsync(u => userIds.Contains(u.Id));
        var userMap = users.ToDictionary(u => u.Id, u => u.FirstName + " " + u.LastName);

        return reviews
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new ReviewDto
            {
                Id = r.Id,
                ProductId = r.ProductId,
                UserId = r.UserId,
                UserName = userMap.TryGetValue(r.UserId, out var name) ? name : string.Empty,
                Rating = r.Rating,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt
            })
            .ToList();
    }

    public async Task<ProductRatingDto> GetProductRatingAsync(int productId)
    {
        var products = await _productRepo.FindAsync(p => p.Id == productId && p.IsActive);
        if (!products.Any())
            throw new KeyNotFoundException("Product not found.");

        var reviews = await _reviewRepo.FindAsync(r => r.ProductId == productId);

        if (!reviews.Any())
        {
            return new ProductRatingDto
            {
                AverageRating = 0,
                TotalReviews = 0
            };
        }

        return new ProductRatingDto
        {
            AverageRating = Math.Round(reviews.Average(r => r.Rating), 1),
            TotalReviews = reviews.Count
        };
    }
}
