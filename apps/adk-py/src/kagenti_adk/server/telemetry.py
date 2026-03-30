# Copyright 2026 © IBM Corp.
# SPDX-License-Identifier: Apache-2.0

from __future__ import annotations

import logging
import os

from fastapi import FastAPI
from opentelemetry import metrics, trace
from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
from opentelemetry.exporter.otlp.proto.http.metric_exporter import OTLPMetricExporter
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.httpx import HTTPXClientInstrumentor
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor, LogRecordExportResult
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.sdk.metrics.export import MetricExportResult, PeriodicExportingMetricReader
from opentelemetry.sdk.resources import (
    SERVICE_NAME,
    SERVICE_VERSION,
    Resource,
)
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor, SpanExportResult

from kagenti_adk import __version__

root_logger = logging.getLogger()
logger = logging.getLogger(__name__)


_DEFAULT_OTEL_ENDPOINT = "http://otel-collector.localtest.me:8080"


class SilentOTLPSpanExporter(OTLPSpanExporter):
    def export(self, *args, **kwargs):
        try:
            return super().export(*args, **kwargs)
        except Exception as e:
            logger.debug(f"OpenTelemetry Exporter failed silently: {e}")
            return SpanExportResult.FAILURE


class SilentOTLPMetricExporter(OTLPMetricExporter):
    def export(self, *args, **kwargs):
        try:
            return super().export(*args, **kwargs)
        except Exception as e:
            logger.debug(f"OpenTelemetry Exporter failed silently: {e}")
            return MetricExportResult.FAILURE


class SilentOTLPLogExporter(OTLPLogExporter):
    def export(self, *args, **kwargs):
        try:
            return super().export(*args, **kwargs)
        except Exception as e:
            logger.debug(f"OpenTelemetry Exporter failed silently: {e}")
            return LogRecordExportResult.FAILURE


def configure_telemetry(app: FastAPI) -> None:
    """Utility that configures opentelemetry with OTLP exporter and FastAPI instrumentation"""

    # Set a sensible default OTLP endpoint for local kagenti-adk deployments
    if not os.environ.get("OTEL_EXPORTER_OTLP_ENDPOINT"):
        os.environ["OTEL_EXPORTER_OTLP_ENDPOINT"] = _DEFAULT_OTEL_ENDPOINT

    # Suppress noisy OTLP exporter logs that flood output when the collector is unreachable
    for _name in (
        "opentelemetry.exporter.otlp.proto.http.metric_exporter",
        "opentelemetry.exporter.otlp.proto.http._log_exporter",
        "opentelemetry.exporter.otlp.proto.http.trace_exporter",
    ):
        logging.getLogger(_name).setLevel(logging.CRITICAL)

    FastAPIInstrumentor.instrument_app(app)

    httpxclient_instrumentor = HTTPXClientInstrumentor()
    if httpxclient_instrumentor:
        httpxclient_instrumentor.instrument()

    try:
        import openai  # noqa: F401
        from opentelemetry.instrumentation.openai import OpenAIInstrumentor

        openai_instrumentor = OpenAIInstrumentor()
        if openai_instrumentor:
            openai_instrumentor.instrument()
    except ModuleNotFoundError:
        pass

    resource = Resource(attributes={SERVICE_NAME: "kagenti-adk-a2a-server", SERVICE_VERSION: __version__})

    # Traces
    provider = TracerProvider(resource=resource)
    processor = BatchSpanProcessor(SilentOTLPSpanExporter())
    provider.add_span_processor(processor)
    trace.set_tracer_provider(provider)

    # Metrics
    meter_provider = MeterProvider(
        resource=resource,
        metric_readers=[PeriodicExportingMetricReader(SilentOTLPMetricExporter())],
    )
    metrics.set_meter_provider(meter_provider)

    # Logs
    logger_provider = LoggerProvider(resource=resource)
    processor = BatchLogRecordProcessor(SilentOTLPLogExporter())
    logger_provider.add_log_record_processor(processor)
    root_logger.addHandler(LoggingHandler(logger_provider=logger_provider))
