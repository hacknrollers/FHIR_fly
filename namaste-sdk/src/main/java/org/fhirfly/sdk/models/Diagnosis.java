package org.fhirfly.sdk.models;

public class Diagnosis {
    private String namasteCode;
    private String description;

    public Diagnosis(String namasteCode, String description) {
        this.namasteCode = namasteCode;
        this.description = description;
    }

    public String getNamasteCode() { return namasteCode; }
    public String getDescription() { return description; }

    public static Diagnosis sample() {
        return new Diagnosis("NAM123", "Sample Namaste Diagnosis");
    }

}
