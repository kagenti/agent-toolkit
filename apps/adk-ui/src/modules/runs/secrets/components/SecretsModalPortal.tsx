/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { useAgentSecrets } from '../../contexts/agent-secrets';
import { SecretsModal } from './SecretsModal';

export function SecretsModalPortal() {
  const { hasSeenModal, markModalAsSeen, demandedSecrets, isPendingVariables } = useAgentSecrets();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (hasSeenModal || isPendingVariables) {
      return;
    }
    const unresolvedSecrets = demandedSecrets.filter((s) => !s.isReady);

    if (unresolvedSecrets.length > 0) {
      markModalAsSeen();
      setIsOpen(true);
    }
  }, [hasSeenModal, markModalAsSeen, demandedSecrets, isPendingVariables]);

  if (!isOpen || typeof document === 'undefined') {
    return null;
  }

  return createPortal(<SecretsModal isOpen={isOpen} onRequestClose={() => setIsOpen(false)} />, document.body);
}
