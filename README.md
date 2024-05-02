Usage
----

Run the project with `npm run dev`.

Overview
----

The URLQueryComponent can be found at `/src/url-query-component`.

If the URL was fetched successfully (to avoid CORS errors I used `https://httpbin.org/get` as
an example URL) the component will display the truncated result with the possibility to
expand/collapse.

If the URL could not be fetched, the component will display the error message received.

Assumptions / Points of improvement
----

The URLQueryComponent doesn't accept any parameters, for example to change the displayed
text or override the styling. I would add parameters to allow customization.

It also doesn't check if the URL is valid before trying to fetch it. I would use a regular
expression to check it beforehand and display an error if it's not a valid URL.

The component would be more user friendly on desktop environments if the input field allowed
the user to hit Enter to automatically trigger the Check URL button instead of forcing the user
to click it or tab to it and then hit Enter.
