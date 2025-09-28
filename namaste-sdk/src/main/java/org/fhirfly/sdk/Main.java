package org.fhirfly.sdk;

import org.fhirfly.sdk.models.FhirBundle;
import org.fhirfly.sdk.models.Diagnosis;
import java.util.List;

public class Main {
    public static void main(String[] args){
        NamasteSdk sdk = new NamasteSdk("https://api.namaste.in/");

        FhirBundle bundle = sdk.getPatientById("123");
        System.out.println("✅ Patient: " + bundle);


        List<Diagnosis> diagnoses = sdk.getAllDiagnoses();
        System.out.println("✅ Diagnoses: " + diagnoses);
    }
}
