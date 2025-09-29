package org.fhirfly.sdk.services;

import org.fhirfly.sdk.ApiClient;
import org.fhirfly.sdk.models.MappingResult;

public class TerminologyService {
    private ApiClient client;

    public TerminologyService(ApiClient client) {
        this.client = client;
    }

    public MappingResult translateDiagnosis(String namasteCode) {
        // dummy
        client.get("/translate?code=" + namasteCode);
        if (namasteCode.equals("NAM123")) {
            return new MappingResult("NAM123", "ICD11-XYZ", "Mapped successfully");
        }
        return new MappingResult(namasteCode, "UNKNOWN", "No mapping found");
    }
}
