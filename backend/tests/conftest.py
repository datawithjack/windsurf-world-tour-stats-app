"""
Pytest configuration and fixtures for API tests.
"""

import pytest
from unittest.mock import MagicMock, patch
from fastapi.testclient import TestClient


@pytest.fixture
def mock_db():
    """Create a mock DatabaseManager for testing."""
    mock = MagicMock()
    mock.execute_query = MagicMock(return_value=[])
    mock.execute_count = MagicMock(return_value=0)
    mock.test_connection = MagicMock(return_value=True)
    return mock


@pytest.fixture
def client(mock_db):
    """Create a test client for the FastAPI app with mocked database."""
    # Patch the global db_manager instance before importing the app
    with patch('src.api.database.db_manager', mock_db):
        # Also patch check_database_health to use our mock
        with patch('src.api.database.check_database_health') as mock_health:
            mock_health.return_value = {
                'status': 'healthy',
                'database': 'test_db',
                'environment': 'test'
            }

            # Import app after patching
            from src.api.main import app
            from src.api.database import get_db

            # Override the dependency to return our mock
            def override_get_db():
                yield mock_db

            app.dependency_overrides[get_db] = override_get_db

            with TestClient(app) as test_client:
                # Attach the mock to the client for easy access in tests
                test_client.mock_db = mock_db
                yield test_client

            # Clean up
            app.dependency_overrides.clear()


@pytest.fixture
def sample_event():
    """Sample event data for testing."""
    return {
        'id': 1,
        'source': 'PWA',
        'year': 2025,
        'event_id': 123,
        'event_name': 'Chile World Cup 2025',
        'event_url': 'https://example.com/event/123',
        'event_date': 'Mar 15-22, 2025',
        'start_date': '2025-03-15',
        'end_date': '2025-03-22',
        'day_window': 8,
        'event_section': 'Wave',
        'event_status': 3,
        'competition_state': 3,
        'has_wave_discipline': True,
        'all_disciplines': 'Wave',
        'country_flag': '🇨🇱',
        'country_code': 'CL',
        'stars': 5,
        'event_image_url': 'https://example.com/image.jpg',
        'total_athletes': 77,
        'total_men': 59,
        'total_women': 18,
    }


@pytest.fixture
def sample_athlete_result():
    """Sample athlete result data for testing.

    Matches the AthleteResult model structure from models.py
    """
    return {
        'result_id': 1,
        'result_source': 'PWA',
        'athlete_id': 100,  # Unified athlete ID (integer)
        'athlete_name': 'Test Athlete',
        'nationality': 'Chile',
        'year_of_birth': 1990,
        'profile_picture_url': 'https://example.com/athlete.jpg',
        'pwa_sail_number': 'CHL-123',
        'event_db_id': 1,
        'event_id': 123,
        'event_name': 'Chile World Cup 2025',
        'event_year': 2025,
        'country_code': 'CL',
        'stars': 5,
        'event_image_url': 'https://example.com/event.jpg',
        'division_label': 'Men Wave',
        'division_code': 'MW',
        'sex': 'Men',
        'placement': '1',
    }


@pytest.fixture
def sample_stats():
    """Sample site stats data for testing."""
    return [
        {'metric': 'Total Events', 'value': '118'},
        {'metric': 'Total Athletes', 'value': '359'},
        {'metric': 'Total Results', 'value': '2052'},
        {'metric': 'Total Heat Scores', 'value': '39460'},
    ]
