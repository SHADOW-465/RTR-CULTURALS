from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Navigate to the login page
    page.goto("http://localhost:3000/auth/login")
    page.screenshot(path="jules-scratch/verification/login_page.png")

    # Fill in the login form and submit
    page.get_by_label("Username").fill("admin")
    page.locator("#password").fill("admin")
    page.get_by_role("button", name="Sign In").click()

    # Wait for navigation to the dashboard and take a screenshot
    page.wait_for_url("**/dashboard/admin")
    page.screenshot(path="jules-scratch/verification/dashboard_page.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
