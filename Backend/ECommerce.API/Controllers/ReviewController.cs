using System.Security.Claims;
using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers
{
    [ApiController]
    [Route("api/reviews")]
    public class ReviewsController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public ReviewsController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateReview([FromBody] CreateReviewDto dto)
        {

            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            try
            {
                // ✅ Extract UserId from JWT
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

                if (userIdClaim == null)
                    return Unauthorized("Invalid token");

                var userId = int.Parse(userIdClaim.Value);

                var result = await _reviewService.CreateReviewAsync(dto, userId);

                return Ok(new
                {
                    message = "Review submitted successfully",
                    data = result
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message); // 404
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message); // invalid rating/comment
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message); // duplicate review
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Internal server error"
                });
            }
        }
    

    [HttpPut("{reviewId}")]
        [Authorize]
        public async Task<IActionResult> UpdateReview(int reviewId, [FromBody] UpdateReviewDto dto)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

                if (userIdClaim == null)
                    return Unauthorized("Invalid token");

                var userId = int.Parse(userIdClaim.Value);

                var result = await _reviewService.UpdateReviewAsync(reviewId, dto, userId);

                return Ok(new
                {
                    message = "Review updated successfully",
                    data = result
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("product/{productId}")]
        public async Task<IActionResult> GetReviews(int productId)
        {
            try
            {
                var result = await _reviewService.GetReviewsByProductIdAsync(productId);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpGet("product/{productId}/rating")]
        public async Task<IActionResult> GetRating(int productId)
        {
            try
            {
                var result = await _reviewService.GetProductRatingAsync(productId);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
     }
}

