package org.fhirfly.sdk;

public class ApiClient {
    private String baseUrl;
    private String token;

    public ApiClient(String baseUrl, String token) {
        this.baseUrl = baseUrl;
        this.token = token;
    }

    // Dummy GET call (replace with OkHttp/Retrofit later)
    public String get(String endpoint) {
        System.out.println("Calling GET " + baseUrl + endpoint + " with token: " + token);
        return "{ \"namaste\": \"NAM123\", \"icd\": \"ICD11-XYZ\" }";
    }
    // Dummy POST call (replace with OkHttp/Retrofit later)
    public String post(String endpoint, String body) {
        System.out.println("Calling POST " + baseUrl + endpoint + " with token: " + token);
        System.out.println("Body: " + body);
        return "{ \"success\": true, \"message\": \"upload success\" }";
    }
}
