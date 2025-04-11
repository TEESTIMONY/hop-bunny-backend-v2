# How to Disable CORS in Your Browser

CORS (Cross-Origin Resource Sharing) is a security feature implemented by browsers that prevents web pages from making requests to a different domain than the one that served the web page. While this is important for security, it can sometimes block legitimate development efforts.

Here are several ways to disable CORS for development purposes:

## Option 1: Use the CORS Bypass HTML Tool

1. Open the `cors-bypass.html` file we created in your browser
2. Use the form to send requests to your API without CORS restrictions
3. This tool uses public CORS proxies to bypass the restrictions

## Option 2: Browser Extensions

### Chrome

1. Install the [CORS Unblock](https://chrome.google.com/webstore/detail/cors-unblock/lfhmikememgdcahcdlaciloancbhjino) extension
2. Click on the extension icon to enable/disable it
3. Reload your page and try your requests again

### Firefox

1. Install the [CORS Everywhere](https://addons.mozilla.org/en-US/firefox/addon/cors-everywhere/) extension
2. Toggle the extension on by clicking its icon
3. Reload your page and try your requests again

## Option 3: Launch Chrome with CORS Disabled

### Windows

1. Close all Chrome instances
2. Create a shortcut to Chrome
3. Right-click the shortcut and select "Properties"
4. In the "Target" field, append this to the end:
   ```
   --disable-web-security --user-data-dir="C:\ChromeDevSession"
   ```
   For example:
   ```
   "C:\Program Files\Google\Chrome\Application\chrome.exe" --disable-web-security --user-data-dir="C:\ChromeDevSession"
   ```
5. Click "OK" and launch Chrome using this shortcut

### macOS

1. Close all Chrome instances
2. Open Terminal
3. Run this command:
   ```
   open -n -a "Google Chrome" --args --disable-web-security --user-data-dir="/tmp/chrome-dev-session"
   ```

## Option 4: Modify Your API Server

The best long-term solution is to configure your API server to properly handle CORS:

1. Add appropriate CORS headers to your server responses:
   - `Access-Control-Allow-Origin: *` (or specify allowed domains)
   - `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
   - `Access-Control-Allow-Headers: Content-Type, Authorization`

2. For production, set specific origins instead of using the wildcard `*`:
   ```
   Access-Control-Allow-Origin: https://yourappdomain.com
   ```

## Warning

Disabling CORS in your browser reduces security. Only do this for development purposes and on trusted websites. Re-enable security features before browsing the general web.

## For Your Specific Issue

Since your API is running on `https://hop-bunny-backend-v2.vercel.app`, you should either:

1. Configure that server to allow CORS requests from your frontend domain
2. Use the cors-bypass.html tool provided
3. Use a browser with CORS disabled via one of the methods above

Remember to only submit sensitive information (like passwords) when using a secure, trusted solution. 