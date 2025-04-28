using Microsoft.Playwright;

namespace PriceWatch.Infrastructure.Services;

public interface IRetailerScraper
{
    Task<decimal?> GetPriceAsync(string url, CancellationToken ct = default);
}

public class RetailerScraper : IRetailerScraper
{
    public async Task<decimal?> GetPriceAsync(string url, CancellationToken ct = default)
    {
        // hoje: implementação stub → devolve preço randômico p/ validação
        await Task.Delay(200, ct);
        var rnd = new Random();
        return Math.Round((decimal)rnd.NextDouble() * 3000, 2);
        
        /*
        // futura implementação real:
        using var playwright = await Playwright.CreateAsync();
        await using var browser = await playwright.Chromium.LaunchAsync(new() { Headless = true });
        var page = await browser.NewPageAsync();
        await page.GotoAsync(url, new PageGotoOptions { Timeout = 15000 });
        var priceText = await page.InnerTextAsync("css=selector-do-preco");
        return decimal.Parse(priceText.Replace("R$", "").Trim(), CultureInfo.GetCultureInfo("pt-BR"));
        */
    }
}
