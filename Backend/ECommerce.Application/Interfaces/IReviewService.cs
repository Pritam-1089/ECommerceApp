using ECommerce.Application.DTOs;

namespace ECommerce.Application.Interfaces
{
    public interface IReviewService
    {
        Task<ReviewDto> CreateReviewAsync(CreateReviewDto dto, int userId);
        Task<ReviewDto> UpdateReviewAsync(int reviewId, UpdateReviewDto dto, int userId);
    }
}
