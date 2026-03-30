# Copyright 2025 © BeeAI a Series of LF Projects, LLC

import pytest

from kagenti_adk.a2a.types import Metadata
from kagenti_adk.server.utils import _merge_recursive, merge_metadata

pytestmark = pytest.mark.unit


def test_scalar_merge():
    assert _merge_recursive(1, 2) == 2
    assert _merge_recursive("a", "b") == "b"
    assert _merge_recursive(True, False) is False
    assert _merge_recursive(None, 1) == 1


def test_list_merge():
    assert _merge_recursive([1, 2], [3, 4]) == [1, 2, 3, 4]
    assert _merge_recursive([], [1]) == [1]
    assert _merge_recursive([1], []) == [1]


def test_dict_merge_simple():
    a = {"x": 1}
    b = {"y": 2}
    expected = {"x": 1, "y": 2}
    assert _merge_recursive(a, b) == expected


def test_dict_merge_overwrite():
    a = {"x": 1}
    b = {"x": 2}
    expected = {"x": 2}
    assert _merge_recursive(a, b) == expected


def test_dict_merge_recursive():
    a = {"x": 1, "y": {"a": 1}}
    b = {"y": {"b": 2}, "z": 3}
    expected = {"x": 1, "y": {"a": 1, "b": 2}, "z": 3}
    assert _merge_recursive(a, b) == expected


def test_dict_merge_nested_list():
    a = {"x": [1]}
    b = {"x": [2]}
    expected = {"x": [1, 2]}
    assert _merge_recursive(a, b) == expected


def test_merge_metadata():
    m1 = Metadata(foo="bar")
    m2 = Metadata(baz="qux")
    merged = merge_metadata(m1, m2)
    assert merged == Metadata(foo="bar", baz="qux")


def test_merge_metadata_recursive():
    m1 = Metadata(nested={"a": 1})
    m2 = Metadata(nested={"b": 2})
    merged = merge_metadata(m1, m2)
    assert merged == Metadata(nested={"a": 1, "b": 2})
