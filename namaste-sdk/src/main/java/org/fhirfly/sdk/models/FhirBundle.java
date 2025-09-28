package org.fhirfly.sdk.models;

public class FhirBundle {
    private String bundleId;
    private String patientName;

    public FhirBundle(String bundleId, String patientName) {
        this.bundleId = bundleId;
        this.patientName = patientName;
    }

    public static FhirBundle sample() {
        return new FhirBundle("BUNDLE123", "Samyak");
    }
    @Override
    public String toString() {
        return "FhirBundle{id='" + bundleId + "', patientName='" + patientName + "'}";
    }
}
