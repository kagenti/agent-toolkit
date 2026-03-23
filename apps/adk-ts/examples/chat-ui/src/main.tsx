/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import './styles.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';

const rootElement = document.getElementById('root')!;

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
