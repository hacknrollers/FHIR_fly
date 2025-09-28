package org.fhirfly.sdk.models;

public class MappingResult {
    private String namasteCode;
    private String icd11Code;
    private String message;

    public MappingResult(String namasteCode, String icd11Code, String message) {
        this.namasteCode = namasteCode;
        this.icd11Code = icd11Code;
        this.message = message;
    }

    @Override
    public String toString() {
        return namasteCode + " -> " + icd11Code + " : " + message;
    }
}
