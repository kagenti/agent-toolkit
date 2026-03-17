{{/*
Expand the name of the chart.
*/}}
{{- define "agentstack.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "agentstack.fullname" -}}
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
{{- define "agentstack.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}


{{/*
Common labels
*/}}
{{- define "agentstack.labels" -}}
helm.sh/chart: {{ include "agentstack.chart" . }}
{{ include "agentstack.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "agentstack.selectorLabels" -}}
app.kubernetes.io/name: {{ include "agentstack.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}


{{/*
*** DATABASE CONFIGURATION ***
(bitnami-style helpers: https://github.com/bitnami/charts/blob/main/bitnami/airflow/templates/_helpers.tpl)
*/}}

{{/*
Create a default fully qualified postgresql name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
*/}}
{{- define "agentstack.postgresql.fullname" -}}
{{- include "common.names.dependency.fullname" (dict "chartName" "postgresql" "chartValues" .Values.postgresql "context" $) -}}
{{- end -}}
{{/*
Return the PostgreSQL Hostname
*/}}
{{- define "agentstack.databaseHost" -}}
{{- if .Values.postgresql.enabled }}
    {{- if eq .Values.postgresql.architecture "replication" }}
        {{- printf "%s-%s" (include "agentstack.postgresql.fullname" .) "primary" | trunc 63 | trimSuffix "-" -}}
    {{- else -}}
        {{- print (include "agentstack.postgresql.fullname" .) -}}
    {{- end -}}
{{- else -}}
    {{- print .Values.externalDatabase.host -}}
{{- end -}}
{{- end -}}

{{/*
Return the PostgreSQL Port
*/}}
{{- define "agentstack.databasePort" -}}
{{- if .Values.postgresql.enabled }}
    {{- print .Values.postgresql.primary.service.ports.postgresql -}}
{{- else -}}
    {{- printf "%d" (.Values.externalDatabase.port | int ) -}}
{{- end -}}
{{- end -}}

{{/*
Return the PostgreSQL Database Name
*/}}
{{- define "agentstack.databaseName" -}}
{{- if .Values.postgresql.enabled }}
    {{- print .Values.postgresql.auth.database -}}
{{- else -}}
    {{- print .Values.externalDatabase.database -}}
{{- end -}}
{{- end -}}

{{/*
Return the PostgreSQL User
*/}}
{{- define "agentstack.databaseUser" -}}
{{- if .Values.postgresql.enabled }}
    {{- print .Values.postgresql.auth.username -}}
{{- else -}}
    {{- print .Values.externalDatabase.user -}}
{{- end -}}
{{- end -}}

{{/*
Return the PostgreSQL Admin Password
*/}}
{{- define "agentstack.databaseAdminUser" -}}
{{- if .Values.postgresql.enabled }}
    {{- printf "postgres" -}}
{{- else -}}
    {{- print .Values.externalDatabase.adminUser -}}
{{- end -}}
{{- end -}}

{{/*
Return the PostgreSQL Password
*/}}
{{- define "agentstack.databasePassword" -}}
{{- if .Values.postgresql.enabled }}
    {{- print .Values.postgresql.auth.password -}}
{{- else -}}
    {{- print .Values.externalDatabase.password -}}
{{- end -}}
{{- end -}}

{{/*
Return the PostgreSQL Admin Password
*/}}
{{- define "agentstack.databaseAdminPassword" -}}
{{- if .Values.postgresql.enabled }}
    {{- print .Values.postgresql.auth.postgresPassword -}}
{{- else -}}
    {{- print .Values.externalDatabase.adminPassword -}}
{{- end -}}
{{- end -}}


{{/*
Return the PostgreSQL Secret Name
*/}}
{{- define "agentstack.databaseSecretName" -}}
{{- if .Values.postgresql.enabled }}
    {{- if .Values.postgresql.auth.existingSecret -}}
    {{- print .Values.postgresql.auth.existingSecret -}}
    {{- else -}}
    {{- print "agentstack-secret" -}}
    {{- end -}}
{{- else if .Values.externalDatabase.existingSecret -}}
    {{- print .Values.externalDatabase.existingSecret -}}
{{- else -}}
    {{- print "agentstack-secret" -}}
{{- end -}}
{{- end -}}

{{/*
Return if SSL is enabled
*/}}
{{- define "agentstack.databaseSslEnabled" -}}
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
{{- define "agentstack.s3.host" -}}
    {{- if .Values.seaweedfs.enabled -}}
        {{- printf "seaweedfs-all-in-one" -}}
    {{- else -}}
        {{- print .Values.externalS3.host -}}
    {{- end -}}
{{- end -}}

{{/*
Return the S3 bucket
*/}}
{{- define "agentstack.s3.bucket" -}}
    {{- if .Values.seaweedfs.enabled -}}
        {{- print .Values.seaweedfs.bucket -}}
    {{- else -}}
        {{- print .Values.externalS3.bucket -}}
    {{- end -}}
{{- end -}}

{{/*
Return the S3 protocol
*/}}
{{- define "agentstack.s3.protocol" -}}
    {{- if .Values.seaweedfs.enabled -}}
        {{- ternary "https" "http" .Values.seaweedfs.global.enableSecurity -}}
    {{- else -}}
        {{- print .Values.externalS3.protocol -}}
    {{- end -}}
{{- end -}}

{{/*
Return the S3 region
*/}}
{{- define "agentstack.s3.region" -}}
    {{- if .Values.seaweedfs.enabled -}}
        {{- print "us-east-1"  -}}
    {{- else -}}
        {{- print .Values.externalS3.region -}}
    {{- end -}}
{{- end -}}

{{/*
Return the S3 port
*/}}
{{- define "agentstack.s3.port" -}}
{{- ternary .Values.seaweedfs.s3.port .Values.externalS3.port .Values.seaweedfs.enabled -}}
{{- end -}}

{{/*
Return the S3 endpoint
*/}}
{{- define "agentstack.s3.endpoint" -}}
{{- $port := include "agentstack.s3.port" . | int -}}
{{- $printedPort := "" -}}
{{- if and (ne $port 80) (ne $port 443) -}}
    {{- $printedPort = printf ":%d" $port -}}
{{- end -}}
{{- printf "%s://%s%s" (include "agentstack.s3.protocol" .) (include "agentstack.s3.host" .) $printedPort -}}
{{- end -}}

{{/*
Return the S3 credentials secret name
*/}}
{{- define "agentstack.s3.secretName" -}}
{{- if .Values.seaweedfs.enabled -}}
    {{- if .Values.seaweedfs.auth.existingSecret -}}
    {{- print .Values.seaweedfs.auth.existingSecret -}}
    {{- else -}}
    {{- print "agentstack-secret" -}}
    {{- end -}}
{{- else if .Values.externalS3.existingSecret -}}
    {{- print .Values.externalS3.existingSecret -}}
{{- else -}}
    {{- print "agentstack-secret" -}}
{{- end -}}
{{- end -}}

{{/*
Return the S3 access key id inside the secret
*/}}
{{- define "agentstack.s3.accessKeyID" -}}
    {{- if .Values.seaweedfs.enabled -}}
        {{- print .Values.seaweedfs.auth.admin.accessKeyID -}}
    {{- else -}}
        {{- print .Values.externalS3.accessKeyID -}}
    {{- end -}}
{{- end -}}

{{/*
Return the S3 secret access key inside the secret
*/}}
{{- define "agentstack.s3.accessKeySecret" -}}
    {{- if .Values.seaweedfs.enabled -}}
        {{- print .Values.seaweedfs.auth.admin.accessKeySecret  -}}
    {{- else -}}
        {{- print .Values.externalS3.accessKeySecret -}}
    {{- end -}}
{{- end -}}




{{/*
Generate imagePullSecrets
*/}}
{{- define "agentstack.imagePullSecrets" -}}
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
{{- define "agentstack.redis.fullname" -}}
{{- include "common.names.dependency.fullname" (dict "chartName" "redis" "chartValues" .Values.redis "context" $) -}}
{{- end -}}

{{/*
Return the Redis Hostname
*/}}
{{- define "agentstack.redis.host" -}}
{{- if .Values.redis.enabled }}
    {{- print (include "agentstack.redis.fullname" .) -}}
{{- else -}}
    {{- print .Values.externalRedis.host -}}
{{- end -}}
{{- end -}}

{{/*
Return the Redis Port
*/}}
{{- define "agentstack.redis.port" -}}
{{- if .Values.redis.enabled }}
    {{- print "6379" -}}
{{- else -}}
    {{- printf "%d" (.Values.externalRedis.port | int ) -}}
{{- end -}}
{{- end -}}

{{/*
Return the Redis Password
*/}}
{{- define "agentstack.redis.password" -}}
{{- if .Values.redis.enabled }}
    {{- print .Values.redis.auth.password -}}
{{- else -}}
    {{- print .Values.externalRedis.password -}}
{{- end -}}
{{- end -}}

{{/*
Return the Redis Secret Name
*/}}
{{- define "agentstack.redis.secretName" -}}
{{- if .Values.redis.enabled }}
    {{- if .Values.redis.auth.existingSecret -}}
    {{- print .Values.redis.auth.existingSecret -}}
    {{- else -}}
    {{- printf "%s" (include "agentstack.redis.fullname" .) -}}
    {{- end -}}
{{- else if .Values.externalRedis.existingSecret -}}
    {{- print .Values.externalRedis.existingSecret -}}
{{- else -}}
    {{- print "agentstack-secret" -}}
{{- end -}}
{{- end -}}

{{/*
Return the Redis Secret Password Key
*/}}
{{- define "agentstack.redis.secretPasswordKey" -}}
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
{{- define "agentstack.redis.enabled" -}}
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
{{- define "agentstack.oidc.internalIssuerUrl" -}}
{{- print .Values.auth.oidcProvider.issuerUrl -}}
{{- end -}}

{{- define "agentstack.oidc.publicIssuerUrl" -}}
{{- if .Values.auth.oidcProvider.publicIssuerUrl -}}
    {{- print .Values.auth.oidcProvider.publicIssuerUrl -}}
{{- else -}}
    {{- print .Values.auth.oidcProvider.issuerUrl -}}
{{- end -}}
{{- end -}}

{{/*
Return the OIDC UI Client ID
*/}}
{{- define "agentstack.oidc.uiClientId" -}}
{{- print .Values.auth.oidcProvider.uiClientId -}}
{{- end -}}

{{/*
Return the OIDC Server Client ID
*/}}
{{- define "agentstack.oidc.serverClientId" -}}
{{- print .Values.auth.oidcProvider.serverClientId -}}
{{- end -}}

{{/*
Return the OIDC UI Client Secret Name
*/}}
{{- define "agentstack.oidc.uiClientSecretName" -}}
{{- if .Values.auth.oidcProvider.existingSecret -}}
    {{- print .Values.auth.oidcProvider.existingSecret -}}
{{- else -}}
    {{- print "agentstack-ui-secret" -}}
{{- end -}}
{{- end -}}

{{/*
Return the OIDC UI Client Secret Key
*/}}
{{- define "agentstack.oidc.uiClientSecretKey" -}}
{{- if .Values.auth.oidcProvider.existingSecret -}}
    {{- print .Values.auth.oidcProvider.uiClientSecretKey -}}
{{- else -}}
    {{- print "agentstackUiClientSecret" -}}
{{- end -}}
{{- end -}}

{{/*
Return the OIDC Server Client Secret Name
*/}}
{{- define "agentstack.oidc.serverClientSecretName" -}}
{{- if .Values.auth.oidcProvider.existingSecret -}}
    {{- print .Values.auth.oidcProvider.existingSecret -}}
{{- else -}}
    {{- print "agentstack-secret" -}}
{{- end -}}
{{- end -}}

{{/*
Return the OIDC Server Client Secret Key
*/}}
{{- define "agentstack.oidc.serverClientSecretKey" -}}
{{- if .Values.auth.oidcProvider.existingSecret -}}
    {{- print .Values.auth.oidcProvider.serverClientSecretKey -}}
{{- else -}}
    {{- print "agentstackServerClientSecret" -}}
{{- end -}}
{{- end -}}

{{- define "agentstack.oidc.providerName" -}}
{{- print .Values.auth.oidcProvider.name -}}
{{- end -}}

{{- define "agentstack.oidc.providerId" -}}
{{- print .Values.auth.oidcProvider.id -}}
{{- end -}}

{{- define "agentstack.oidc.rolesPath" -}}
{{- print .Values.auth.oidcProvider.rolesPath -}}
{{- end -}}

{{/*
Return the OIDC UI Client Secret Value
*/}}
{{- define "agentstack.oidc.uiClientSecretValue" -}}
{{- $uiClientSecret := .Values.auth.oidcProvider.uiClientSecret -}}
{{- $secret := (lookup "v1" "Secret" .Release.Namespace "agentstack-ui-secret") -}}
{{- if and $secret $secret.data (hasKey $secret.data "agentstackUiClientSecret") -}}
    {{- $uiClientSecret = index $secret.data "agentstackUiClientSecret" | b64dec -}}
{{- end -}}
{{- if not $uiClientSecret -}}
    {{- $uiClientSecret = randAlphaNum 32 -}}
{{- end -}}
{{- print $uiClientSecret -}}
{{- end -}}

{{/*
Return the OIDC Server Client Secret Value
*/}}
{{- define "agentstack.oidc.serverClientSecretValue" -}}
{{- $serverClientSecret := .Values.auth.oidcProvider.serverClientSecret -}}
{{- $secret := (lookup "v1" "Secret" .Release.Namespace "agentstack-secret") -}}
{{- if and $secret $secret.data (hasKey $secret.data "agentstackServerClientSecret") -}}
    {{- $serverClientSecret = index $secret.data "agentstackServerClientSecret" | b64dec -}}
{{- end -}}
{{- if not $serverClientSecret -}}
    {{- $serverClientSecret = randAlphaNum 32 -}}
{{- end -}}
{{- print $serverClientSecret -}}
{{- end -}}