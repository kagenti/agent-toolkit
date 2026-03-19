/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FeedbackForm {
  vote?: FeedbackVote;
  categories?: FeedbackCategory[];
  comment?: string;
}

export type FeedbackCategory = {
  id: string;
  label: string;
};

export enum FeedbackVote {
  Up = 'up',
  Down = 'down',
}
