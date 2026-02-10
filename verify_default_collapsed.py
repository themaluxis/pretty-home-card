from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the mock page (should load with collapsed state by default)
        page.goto("http://localhost:8000/mock_collapsible.html")
        time.sleep(2)

        # Take screenshot of default state
        page.screenshot(path="/home/jules/verification/default_collapsed.png")
        print("Screenshot saved: default_collapsed.png")

        # Verify hidden state via JS
        is_hidden = page.evaluate("""() => {
            const card = document.querySelector('pretty-home-card');
            const container = card.shadowRoot.querySelector('#forecastContainer');
            const rows = card.shadowRoot.querySelector('.forecast-rows');
            const computedStyle = window.getComputedStyle(rows);
            return container.classList.contains('collapsed') && computedStyle.display === 'none';
        }""")

        if is_hidden:
            print("SUCCESS: Forecast rows are hidden by default.")
        else:
            print("FAILURE: Forecast rows are NOT hidden by default.")

        browser.close()

if __name__ == "__main__":
    run()
