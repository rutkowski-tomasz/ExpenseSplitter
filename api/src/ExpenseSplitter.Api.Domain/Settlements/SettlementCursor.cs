using System.Text;
using System.Text.Json;

namespace ExpenseSplitter.Api.Domain.Settlements;

public sealed record SettlementCursor(DateTime UpdatedOnUtc)
{
    public static string Encode(DateTime updatedOnUtc)
    {
        var cursor = new SettlementCursor(updatedOnUtc);
        var json = JsonSerializer.Serialize(cursor);
        var jsonBytes = Encoding.UTF8.GetBytes(json);
        return Convert.ToBase64String(jsonBytes);
    }

    public static SettlementCursor? Decode(string? cursor)
    {
        if (string.IsNullOrWhiteSpace(cursor))
        {
            return null;
        }

        try
        {
            var jsonBytes = Convert.FromBase64String(cursor);
            var json = Encoding.UTF8.GetString(jsonBytes);
            return JsonSerializer.Deserialize<SettlementCursor>(json);
        }
        catch
        {
            return null;
        }
    }
}
