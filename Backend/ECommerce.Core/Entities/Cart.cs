namespace ECommerce.Core.Entities;

public class Cart : BaseEntity
{
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
}
