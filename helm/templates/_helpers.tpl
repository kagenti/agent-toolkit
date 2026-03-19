{{/*
Expand the name of the chart.
*/}}
{{- define "kagenti-adk.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "kagenti-adk.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "kagenti-adk.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}


{{/*
Common labels
*/}}
{{- define "kagenti-adk.labels" -}}
helm.sh/chart: {{ include "kagenti-adk.chart" . }}
{{ include "kagenti-adk.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "kagenti-adk.selectorLabels" -}}
app.kubernetes.io/name: {{ include "kagenti-adk.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}


{{/*
*** DATABASE CONFIGURATION ***
*/}}

{{/*
Return the PostgreSQL Hostname
*/}}
{{- define "kagenti-adk.databaseHost" -}}
{{- if .Values.postgresql.enabled }}
    {{- print (.Values.postgresql.fullnameOverride | default "postgresql") -}}
{{- else -}}
    {{- print .Values.externalDatabase.host -}}
{{- end -}}
{{- end -}}

{{/*
Return the PostgreSQL Port
*/}}
{{- define "kagenti-adk.databasePort" -}}
{{- if .Values.postgresql.enabled }}
    {{- print (.Values.postgresql.service.port | default 5432) -}}
{{- else -}}
    {{- printf "%d" (.Values.externalDatabase.port | int ) -}}
{{- end -}}
{{- end -}}

{{/*
Return the PostgreSQL Database Name
*/}}
{{- define "kagenti-adk.databaseName" -}}
{{- if .Values.postgresql.enabled }}
    {{- print .Values.postgresql.auth.database -}}
{{- else -}}
    {{- print .Values.externalDatabase.database -}}
{{- end -}}
{{- end -}}

{{/*
Return the PostgreSQL User
*/}}
{{- define "kagenti-adk.databaseUser" -}}
{{- if .Values.postgresql.enabled }}
    {{- print (.Values.postgresql.auth.username | default "postgres") -}}
{{- else -}}
    {{- print .Values.externalDatabase.user -}}
{{- end -}}
{{- end -}}

{{/*
Return the PostgreSQL Admin User
*/}}
{{- define "kagenti-adk.databaseAdminUser" -}}
{{- if .Values.postgresql.enabled }}
    {{- print (.Values.postgresql.auth.username | default "postgres") -}}
{{- else -}}
    {{- print .Values.externalDatabase.adminUser -}}
{{- end -}}
{{- end -}}

{{/*
Return the PostgreSQL Password
*/}}
{{- define "kagenti-adk.databasePassword" -}}
{{- if .Values.postgresql.enabled }}
    {{- print .Values.postgresql.auth.password -}}
{{- else -}}
    {{- print .Values.externalDatabase.password -}}
{{- end -}}
{{- end -}}

{{/*
Return the PostgreSQL Admin Password
*/}}
{{- define "kagenti-adk.databaseAdminPassword" -}}
{{- if .Values.postgresql.enabled }}
    {{- print .Values.postgresql.auth.password -}}
{{- else -}}
    {{- print .Values.externalDatabase.adminPassword -}}
{{- end -}}
{{- end -}}


{{/*
Return the PostgreSQL Secret Name
*/}}
{{- define "kagenti-adk.databaseSecretName" -}}
{{- if .Values.postgresql.enabled }}
    {{- print "adk-secret" -}}
{{- else if .Values.externalDatabase.existingSecret -}}
    {{- print .Values.externalDatabase.existingSecret -}}
{{- else -}}
    {{- print "adk-secret" -}}
{{- end -}}
{{- end -}}

{{/*
Return if SSL is enabled
*/}}
{{- define "kagenti-adk.databaseSslEnabled" -}}
{{- if and (not .Values.postgresql.enabled) .Values.externalDatabase.ssl -}}
true
{{- end -}}
{{- end -}}


{{/*
*** S3 CONFIGURATION ***
(bitnami-style helpers: https://github.com/bitnami/charts/blob/main/bitnami/airflow/templates/_helpers.tpl)
*/}}

{{/*
Return the S3 backend host
*/}}
{{- define "kagenti-adk.s3.host" -}}
    {{- if .Values.seaweedfs.enabled -}}
        {{- printf "seaweedfs-all-in-one" -}}
    {{- else -}}
        {{- print .Values.externalS3.host -}}
    {{- end -}}
{{- end -}}

{{/*
Return the S3 bucket
*/}}
{{- define "kagenti-adk.s3.bucket" -}}
    {{- if .Values.seaweedfs.enabled -}}
        {{- print .Values.seaweedfs.bucket -}}
    {{- else -}}
        {{- print .Values.externalS3.bucket -}}
    {{- end -}}
{{- end -}}

{{/*
Return the S3 protocol
*/}}
{{- define "kagenti-adk.s3.protocol" -}}
    {{- if .Values.seaweedfs.enabled -}}
        {{- ternary "https" "http" .Values.seaweedfs.global.enableSecurity -}}
    {{- else -}}
        {{- print .Values.externalS3.protocol -}}
    {{- end -}}
{{- end -}}

{{/*
Return the S3 region
*/}}
{{- define "kagenti-adk.s3.region" -}}
    {{- if .Values.seaweedfs.enabled -}}
        {{- print "us-east-1"  -}}
    {{- else -}}
        {{- print .Values.externalS3.region -}}
    {{- end -}}
{{- end -}}

{{/*
Return the S3 port
*/}}
{{- define "kagenti-adk.s3.port" -}}
{{- ternary .Values.seaweedfs.s3.port .Values.externalS3.port .Values.seaweedfs.enabled -}}
{{- end -}}

{{/*
Return the S3 endpoint
*/}}
{{- define "kagenti-adk.s3.endpoint" -}}
{{- $port := include "kagenti-adk.s3.port" . | int -}}
{{- $printedPort := "" -}}
{{- if and (ne $port 80) (ne $port 443) -}}
    {{- $printedPort = printf ":%d" $port -}}
{{- end -}}
{{- printf "%s://%s%s" (include "kagenti-adk.s3.protocol" .) (include "kagenti-adk.s3.host" .) $printedPort -}}
{{- end -}}

{{/*
Return the S3 credentials secret name
*/}}
{{- define "kagenti-adk.s3.secretName" -}}
{{- if .Values.seaweedfs.enabled -}}
    {{- if .Values.seaweedfs.auth.existingSecret -}}
    {{- print .Values.seaweedfs.auth.existingSecret -}}
    {{- else -}}
    {{- print "adk-secret" -}}
    {{- end -}}
{{- else if .Values.externalS3.existingSecret -}}
    {{- print .Values.externalS3.existingSecret -}}
{{- else -}}
    {{- print "adk-secret" -}}
{{- end -}}
{{- end -}}

{{/*
Return the S3 access key id inside the secret
*/}}
{{- define "kagenti-adk.s3.accessKeyID" -}}
    {{- if .Values.seaweedfs.enabled -}}
        {{- print .Values.seaweedfs.auth.admin.accessKeyID -}}
    {{- else -}}
        {{- print .Values.externalS3.accessKeyID -}}
    {{- end -}}
{{- end -}}

{{/*
Return the S3 secret access key inside the secret
*/}}
{{- define "kagenti-adk.s3.accessKeySecret" -}}
    {{- if .Values.seaweedfs.enabled -}}
        {{- print .Values.seaweedfs.auth.admin.accessKeySecret  -}}
    {{- else -}}
        {{- print .Values.externalS3.accessKeySecret -}}
    {{- end -}}
{{- end -}}




{{/*
Generate imagePullSecrets
*/}}
{{- define "kagenti-adk.imagePullSecrets" -}}
{{- if .Values.imagePullSecrets -}}
imagePullSecrets:
{{- range .Values.imagePullSecrets }}
  - name: {{ .name }}
{{- end -}}
{{- end -}}
{{- end }}


{{/*
*** REDIS CONFIGURATION ***
*/}}

{{/*
Create a default fully qualified redis name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
*/}}
{{- define "kagenti-adk.redis.fullname" -}}
{{- print (.Values.redis.fullnameOverride | default "redis") -}}
{{- end -}}

{{/*
Return the Redis Hostname
*/}}
{{- define "kagenti-adk.redis.host" -}}
{{- if .Values.redis.enabled }}
    {{- print (include "kagenti-adk.redis.fullname" .) -}}
{{- else -}}
    {{- print .Values.externalRedis.host -}}
{{- end -}}
{{- end -}}

{{/*
Return the Redis Port
*/}}
{{- define "kagenti-adk.redis.port" -}}
{{- if .Values.redis.enabled }}
    {{- print "6379" -}}
{{- else -}}
    {{- printf "%d" (.Values.externalRedis.port | int ) -}}
{{- end -}}
{{- end -}}

{{/*
Return the Redis Password
*/}}
{{- define "kagenti-adk.redis.password" -}}
{{- if .Values.redis.enabled }}
    {{- print .Values.redis.auth.password -}}
{{- else -}}
    {{- print .Values.externalRedis.password -}}
{{- end -}}
{{- end -}}

{{/*
Return the Redis Secret Name
*/}}
{{- define "kagenti-adk.redis.secretName" -}}
{{- if .Values.redis.enabled }}
    {{- if .Values.redis.auth.existingSecret -}}
    {{- print .Values.redis.auth.existingSecret -}}
    {{- else -}}
    {{- printf "%s" (include "kagenti-adk.redis.fullname" .) -}}
    {{- end -}}
{{- else if .Values.externalRedis.existingSecret -}}
    {{- print .Values.externalRedis.existingSecret -}}
{{- else -}}
    {{- print "adk-secret" -}}
{{- end -}}
{{- end -}}

{{/*
Return the Redis Secret Password Key
*/}}
{{- define "kagenti-adk.redis.secretPasswordKey" -}}
{{- if .Values.redis.enabled }}
    {{- if .Values.redis.auth.existingSecretPasswordKey -}}
    {{- print .Values.redis.auth.existingSecretPasswordKey -}}
    {{- else -}}
    {{- print "redis-password" -}}
    {{- end -}}
{{- else if .Values.externalRedis.existingSecretPasswordKey -}}
    {{- print .Values.externalRedis.existingSecretPasswordKey -}}
{{- end -}}
{{- end -}}

{{/*
Return if Redis is enabled
*/}}
{{- define "kagenti-adk.redis.enabled" -}}
{{- if or .Values.redis.enabled .Values.externalRedis.host -}}
true
{{- else -}}
false
{{- end -}}
{{- end -}}


{{/*
*** OIDC CONFIGURATION ***
*/}}

{{/*
Return the OIDC Issuer URL
*/}}
{{- define "kagenti-adk.oidc.internalIssuerUrl" -}}
{{- print .Values.auth.oidcProvider.issuerUrl -}}
{{- end -}}

{{- define "kagenti-adk.oidc.publicIssuerUrl" -}}
{{- if .Values.auth.oidcProvider.publicIssuerUrl -}}
    {{- print .Values.auth.oidcProvider.publicIssuerUrl -}}
{{- else -}}
    {{- print .Values.auth.oidcProvider.issuerUrl -}}
{{- end -}}
{{- end -}}

{{/*
Return the OIDC UI Client ID
*/}}
{{- define "kagenti-adk.oidc.uiClientId" -}}
{{- print .Values.auth.oidcProvider.uiClientId -}}
{{- end -}}

{{/*
Return the OIDC Server Client ID
*/}}
{{- define "kagenti-adk.oidc.serverClientId" -}}
{{- print .Values.auth.oidcProvider.serverClientId -}}
{{- end -}}

{{/*
Return the OIDC UI Client Secret Name
*/}}
{{- define "kagenti-adk.oidc.uiClientSecretName" -}}
{{- if .Values.auth.oidcProvider.existingSecret -}}
    {{- print .Values.auth.oidcProvider.existingSecret -}}
{{- else -}}
    {{- print "adk-ui-secret" -}}
{{- end -}}
{{- end -}}

{{/*
Return the OIDC UI Client Secret Key
*/}}
{{- define "kagenti-adk.oidc.uiClientSecretKey" -}}
{{- if .Values.auth.oidcProvider.existingSecret -}}
    {{- print .Values.auth.oidcProvider.uiClientSecretKey -}}
{{- else -}}
    {{- print "adkUiClientSecret" -}}
{{- end -}}
{{- end -}}

{{/*
Return the OIDC Server Client Secret Name
*/}}
{{- define "kagenti-adk.oidc.serverClientSecretName" -}}
{{- if .Values.auth.oidcProvider.existingSecret -}}
    {{- print .Values.auth.oidcProvider.existingSecret -}}
{{- else -}}
    {{- print "adk-secret" -}}
{{- end -}}
{{- end -}}

{{/*
Return the OIDC Server Client Secret Key
*/}}
{{- define "kagenti-adk.oidc.serverClientSecretKey" -}}
{{- if .Values.auth.oidcProvider.existingSecret -}}
    {{- print .Values.auth.oidcProvider.serverClientSecretKey -}}
{{- else -}}
    {{- print "adkServerClientSecret" -}}
{{- end -}}
{{- end -}}

{{- define "kagenti-adk.oidc.providerName" -}}
{{- print .Values.auth.oidcProvider.name -}}
{{- end -}}

{{- define "kagenti-adk.oidc.providerId" -}}
{{- print .Values.auth.oidcProvider.id -}}
{{- end -}}

{{- define "kagenti-adk.oidc.rolesPath" -}}
{{- print .Values.auth.oidcProvider.rolesPath -}}
{{- end -}}

{{/*
Return the OIDC UI Client Secret Value
*/}}
{{- define "kagenti-adk.oidc.uiClientSecretValue" -}}
{{- $uiClientSecret := .Values.auth.oidcProvider.uiClientSecret -}}
{{- $secret := (lookup "v1" "Secret" .Release.Namespace "adk-ui-secret") -}}
{{- if and $secret $secret.data (hasKey $secret.data "adkUiClientSecret") -}}
    {{- $uiClientSecret = index $secret.data "adkUiClientSecret" | b64dec -}}
{{- end -}}
{{- if not $uiClientSecret -}}
    {{- $uiClientSecret = randAlphaNum 32 -}}
{{- end -}}
{{- print $uiClientSecret -}}
{{- end -}}

{{/*
Return the OIDC Server Client Secret Value
*/}}
{{- define "kagenti-adk.oidc.serverClientSecretValue" -}}
{{- $serverClientSecret := .Values.auth.oidcProvider.serverClientSecret -}}
{{- $secret := (lookup "v1" "Secret" .Release.Namespace "adk-secret") -}}
{{- if and $secret $secret.data (hasKey $secret.data "adkServerClientSecret") -}}
    {{- $serverClientSecret = index $secret.data "adkServerClientSecret" | b64dec -}}
{{- end -}}
{{- if not $serverClientSecret -}}
    {{- $serverClientSecret = randAlphaNum 32 -}}
{{- end -}}
{{- print $serverClientSecret -}}
{{- end -}}
