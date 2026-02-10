from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the mock page
        page.goto("http://localhost:8000/mock_collapsible.html")
        time.sleep(2)

        # Take screenshot of expanded state
        page.screenshot(path="/home/jules/verification/collapsible_expanded.png")
        print("Screenshot saved: collapsible_expanded.png")

        # Click the toggle
        # The toggle is .forecast-header
        # Note: Playwright needs to click inside the shadow DOM or we use evaluate
        # However, standard selectors might not pierce shadow DOM easily unless configured.
        # Let's try locating it.

        # Since it's a custom element 'pretty-home-card', we pierce shadow root manually or use locator
        # page.locator('pretty-home-card').evaluateHandle...

        # Simulating click via JS is easier here for reliability in shadow dom
        page.evaluate("""() => {
            const card = document.querySelector('pretty-home-card');
            const header = card.shadowRoot.querySelector('#forecastHeader');
            header.click();
        }""")

        time.sleep(1) # Wait for transition/update

        # Take screenshot of collapsed state
        page.screenshot(path="/home/jules/verification/collapsible_collapsed.png")
        print("Screenshot saved: collapsible_collapsed.png")

        # Verify state via JS
        is_hidden = page.evaluate("""() => {
            const card = document.querySelector('pretty-home-card');
            const container = card.shadowRoot.querySelector('#forecastContainer');
            const rows = card.shadowRoot.querySelector('.forecast-rows');
            const computedStyle = window.getComputedStyle(rows);
            return container.classList.contains('collapsed') && computedStyle.display === 'none';
        }""")

        if is_hidden:
            print("SUCCESS: Forecast rows are hidden.")
        else:
            print("FAILURE: Forecast rows are NOT hidden.")

        browser.close()

if __name__ == "__main__":
    run()
