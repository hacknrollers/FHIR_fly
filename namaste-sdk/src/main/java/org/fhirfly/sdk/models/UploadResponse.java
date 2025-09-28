package org.fhirfly.sdk.models;

public class UploadResponse {
    private boolean success;
    private String message;

    public UploadResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    @Override
    public String toString() {
        return "Success: " + success + ", Message: " + message;
    }
}
