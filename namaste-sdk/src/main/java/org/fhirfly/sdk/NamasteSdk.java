package org.fhirfly.sdk;

import org.fhirfly.sdk.auth.AuthManager;
import org.fhirfly.sdk.models.Diagnosis;
import org.fhirfly.sdk.models.FhirBundle;
import org.fhirfly.sdk.models.MappingResult;
import org.fhirfly.sdk.models.UploadResponse;
import org.fhirfly.sdk.services.BundleService;
import org.fhirfly.sdk.services.TerminologyService;

import java.util.List;

public class NamasteSdk {
    private final ApiClient apiClient;
    private final TerminologyService terminologyService;
    private final BundleService bundleService;

    // Constructor
    public NamasteSdk(String baseUrl) {
        // Auth manager provides dummy token for now
        AuthManager auth = new AuthManager();
        String token = auth.getToken();

        // ApiClient initialized with base URL + token
        this.apiClient = new ApiClient(baseUrl, token);

        // Services initialized with ApiClient
        this.terminologyService = new TerminologyService(apiClient);
        this.bundleService = new BundleService(apiClient);
    }

    /** Translate Namaste code → ICD-11 (dummy for prototype) */
    public MappingResult translateDiagnosis(String namasteCode) {
        return terminologyService.translateDiagnosis(namasteCode);
    }

    public UploadResponse uploadBundle(FhirBundle bundle) {
        return bundleService.uploadBundle(bundle);
    }

    public FhirBundle getPatientById(String id) {
        // For prototype, return dummy bundle instead of API call
        return new FhirBundle(id, "Samyak");
    }

    public List<Diagnosis> getAllDiagnoses() {
        return List.of(
                new Diagnosis("NAM123", "Sample Namaste Diagnosis"),
                new Diagnosis("NAM456", "Another Diagnosis")
        );
    }

}
