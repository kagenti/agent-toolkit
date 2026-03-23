/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

export function blurActiveElement() {
  const activeElem = document.activeElement;
  if (activeElem instanceof HTMLElement) {
    activeElem.blur();
  }
}
