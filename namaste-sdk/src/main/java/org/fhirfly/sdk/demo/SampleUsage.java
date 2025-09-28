package org.fhirfly.sdk.demo;

import org.fhirfly.sdk.NamasteSdk;
import org.fhirfly.sdk.models.FhirBundle;
import org.fhirfly.sdk.models.MappingResult;
import org.fhirfly.sdk.models.UploadResponse;

public class SampleUsage {
    public static void main(String[] args){
        NamasteSdk sdk = new NamasteSdk("https://dummy.fhir.api");

        MappingResult result = sdk.translateDiagnosis("NAM123");
        System.out.println("✅ Mapping: " + result);

        FhirBundle patientBundle = sdk.getPatientById("123");
        System.out.println("✅ Patient inside bundle: " + patientBundle);

        UploadResponse response = sdk.uploadBundle(FhirBundle.sample());
        System.out.println("✅ Upload: " + response);
        System.out.println("✅ All Diagnoses: " + sdk.getAllDiagnoses());

    }
}
