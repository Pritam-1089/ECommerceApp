using ECommerce.Application.DTOs;

namespace ECommerce.Application.Interfaces
{
    public interface IReviewService
    {
        Task<ReviewDto> CreateReviewAsync(CreateReviewDto dto, int userId);
        Task<List<ReviewDto>> GetReviewsByProductIdAsync(int productId);
        Task<ProductRatingDto> GetProductRatingAsync(int productId);
    }
}
