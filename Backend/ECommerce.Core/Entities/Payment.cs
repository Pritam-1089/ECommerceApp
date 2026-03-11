namespace ECommerce.Core.Entities;

public class Payment : BaseEntity
{
    public int OrderId { get; set; }
    public string TransactionId { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public PaymentMethod Method { get; set; }
    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

    public Order Order { get; set; } = null!;
}

public enum PaymentMethod
{
    CreditCard,
    DebitCard,
    UPI,
    NetBanking,
    CashOnDelivery
}

public enum PaymentStatus
{
    Pending,
    Completed,
    Failed,
    Refunded
}
