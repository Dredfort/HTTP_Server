// Fill out your copyright notice in the Description page of Project Settings.

#include "EZActorComponent_Logger.h"


#include "HttpService.h"


// Sets default values for this component's properties
UEZActorComponent_Logger::UEZActorComponent_Logger()
{
	// Set this component to be initialized when the game starts, and to be ticked every frame.  You can turn these features
	// off to improve performance if you don't need them.
	PrimaryComponentTick.bCanEverTick = false;

	// ...
}

void UEZActorComponent_Logger::BeginPlay()
{
	Super::BeginPlay();

	// ...
	if(GetOwnerRole() == ROLE_Authority)
	{

		FHttpModule* Http = &FHttpModule::Get();
		TSharedRef<IHttpRequest> Request = Http->CreateRequest();
		Request->SetURL(FString("http://10.0.1.172:3000/ue4/stats") /*+ GetName()*/);
		Request->SetHeader(TEXT("User-Agent"), TEXT("X-UnrealEngine-Agent"));
		Request->SetHeader("Content-Type", TEXT("application/json"));

		Request->SetVerb("POST");

		// Content body. http://www.wraiyth.com/?p=198
		TSharedPtr<FJsonObject> JsonObject = MakeShareable(new FJsonObject);
		JsonObject->SetStringField("Name", GetName());
		FString OutputString;
		TSharedRef< TJsonWriter<> > Writer = TJsonWriterFactory<>::Create(&OutputString);
		FJsonSerializer::Serialize(JsonObject.ToSharedRef(), Writer);
		// Content body.

		Request->SetContentAsString(OutputString);

		Request->ProcessRequest();

		Request->OnProcessRequestComplete().BindLambda([&](FHttpRequestPtr Request, FHttpResponsePtr Response, bool bWasSuccessful)
		{
			if (Response.IsValid())
			{
				UE_LOG(LogTemp, Warning, TEXT("response: | %s"), *Response->GetContentAsString());
			}
			else
			{
				UE_LOG(LogTemp, Warning, TEXT("response: | NULL"));
			}
		});
	}	
}