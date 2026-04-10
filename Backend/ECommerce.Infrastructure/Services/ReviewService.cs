using Microsoft.EntityFrameworkCore; 
using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using ECommerce.Core.Entities;
using ECommerce.Infrastructure.Data;

namespace ECommerce.Infrastructure.Services 
{
    public class ReviewService : IReviewService
    {
        private readonly AppDbContext _context;

        public ReviewService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ReviewDto> CreateReviewAsync(CreateReviewDto dto, int userId)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.Id == dto.ProductId && p.IsActive);

            if (product == null)
                throw new KeyNotFoundException("Product not found.");

            if (dto.Rating < 1 || dto.Rating > 5)
                throw new ArgumentException("Rating must be between 1 and 5.");

            if (string.IsNullOrWhiteSpace(dto.Comment))
                throw new ArgumentException("Comment cannot be empty.");

            var alreadyReviewed = await _context.Reviews
                .AnyAsync(r => r.ProductId == dto.ProductId && r.UserId == userId);

            if (alreadyReviewed)
                throw new InvalidOperationException("You have already reviewed this product.");

            var user = await _context.Users.FindAsync(userId);

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

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

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

            public async Task<ReviewDto> UpdateReviewAsync(int reviewId, UpdateReviewDto dto, int userId)
        {
            var review = await _context.Reviews
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.Id == reviewId);

            // ❌ Review not found
            if (review == null)
                throw new KeyNotFoundException("Review not found.");

            // ❌ Other user trying to update
            if (review.UserId != userId)
                throw new UnauthorizedAccessException("You can only update your own review.");

            // ❌ Invalid rating
            if (dto.Rating < 1 || dto.Rating > 5)
                throw new ArgumentException("Rating must be between 1 and 5.");

            // ❌ Empty comment
            if (string.IsNullOrWhiteSpace(dto.Comment))
                throw new ArgumentException("Comment cannot be empty.");

            // ✅ Update values
            review.Rating = dto.Rating;
            review.Comment = dto.Comment;
            review.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new ReviewDto
            {
                Id = review.Id,
                ProductId = review.ProductId,
                UserId = review.UserId,
                UserName = review.User.FirstName + " " + review.User.LastName,
                Rating = review.Rating,
                Comment = review.Comment,
                CreatedAt = review.CreatedAt
            };
        }

        public async Task<List<ReviewDto>> GetReviewsByProductIdAsync(int productId)
        {
            var productExists = await _context.Products
                .AnyAsync(p => p.Id == productId && p.IsActive);

            if (!productExists)
                throw new KeyNotFoundException("Product not found.");

            var reviews = await _context.Reviews
                .Include(r => r.User)
                .Where(r => r.ProductId == productId)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new ReviewDto
                {
                    Id = r.Id,
                    ProductId = r.ProductId,
                    UserId = r.UserId,
                    UserName = r.User.FirstName + " " + r.User.LastName,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt
                })
                .ToListAsync();

            return reviews;
        }

        public async Task<ProductRatingDto> GetProductRatingAsync(int productId)
        {
            var productExists = await _context.Products
                .AnyAsync(p => p.Id == productId && p.IsActive);

            if (!productExists)
                throw new KeyNotFoundException("Product not found.");

            var reviews = await _context.Reviews
                .Where(r => r.ProductId == productId)
                .ToListAsync();

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

    }

