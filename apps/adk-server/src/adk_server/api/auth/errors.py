# Copyright 2026 © IBM Corp.
# SPDX-License-Identifier: Apache-2.0


from __future__ import annotations

class DiscoveryError(RuntimeError):
    pass


class IssuerDiscoveryError(DiscoveryError):
    pass


class JWKSDiscoveryError(DiscoveryError):
    pass


class IntrospectionDiscoveryError(DiscoveryError):
    pass


class UserInfoDiscoveryError(DiscoveryError):
    pass
