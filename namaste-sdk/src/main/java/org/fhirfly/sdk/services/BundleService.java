package org.fhirfly.sdk.services;

import org.fhirfly.sdk.ApiClient;
import org.fhirfly.sdk.models.FhirBundle;
import org.fhirfly.sdk.models.UploadResponse;


public class BundleService {
    private ApiClient client;

    public BundleService(ApiClient client) {
        this.client = client;
    }

    public UploadResponse uploadBundle(FhirBundle bundle) {
        // Dummy for now
        client.post("/bundle/upload", "{ \"bundleId\": \"" + bundle.toString() + "\" }");
        return new UploadResponse(true, "Bundle uploaded successfully ");
    }
}
