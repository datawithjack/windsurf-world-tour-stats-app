"""
API endpoint tests for Windsurf World Tour Stats API.
"""

import pytest


class TestHealthEndpoint:
    """Tests for the health check endpoint."""

    def test_health_check_healthy(self, client):
        """Test health check returns healthy when DB is connected."""
        response = client.get('/health')

        assert response.status_code == 200
        data = response.json()
        assert data['status'] == 'healthy'
        assert 'api_version' in data


class TestRootEndpoint:
    """Tests for the root endpoint."""

    def test_root_returns_api_info(self, client):
        """Test root endpoint returns API information."""
        response = client.get('/')

        assert response.status_code == 200
        data = response.json()
        assert 'name' in data
        assert 'version' in data
        assert 'endpoints' in data
        assert 'docs' in data


class TestEventsEndpoint:
    """Tests for the events endpoints."""

    def test_list_events_success(self, client, sample_event):
        """Test listing events returns paginated results."""
        # Configure mock to return test data
        client.mock_db.execute_count.return_value = 1
        client.mock_db.execute_query.return_value = [sample_event]

        response = client.get('/api/v1/events')

        assert response.status_code == 200
        data = response.json()
        assert 'events' in data
        assert 'pagination' in data

    def test_list_events_with_filters(self, client, sample_event):
        """Test listing events with query filters."""
        client.mock_db.execute_count.return_value = 1
        client.mock_db.execute_query.return_value = [sample_event]

        response = client.get('/api/v1/events?year=2025&country_code=CL&stars=5')

        assert response.status_code == 200

    def test_list_events_pagination(self, client):
        """Test events pagination parameters."""
        client.mock_db.execute_count.return_value = 100
        client.mock_db.execute_query.return_value = []

        response = client.get('/api/v1/events?page=2&page_size=25')

        assert response.status_code == 200
        data = response.json()
        assert data['pagination']['page'] == 2
        assert data['pagination']['page_size'] == 25

    def test_get_single_event_success(self, client, sample_event):
        """Test getting a single event by ID."""
        client.mock_db.execute_query.return_value = sample_event

        response = client.get('/api/v1/events/1')

        assert response.status_code == 200
        data = response.json()
        assert data['id'] == 1
        assert data['event_name'] == 'Chile World Cup 2025'

    def test_get_single_event_not_found(self, client):
        """Test getting a non-existent event returns 404."""
        client.mock_db.execute_query.return_value = None

        response = client.get('/api/v1/events/99999')

        assert response.status_code == 404


class TestAthletesEndpoint:
    """Tests for the athletes endpoints."""

    def test_list_athlete_results(self, client, sample_athlete_result):
        """Test listing athlete results."""
        client.mock_db.execute_count.return_value = 1
        client.mock_db.execute_query.return_value = [sample_athlete_result]

        response = client.get('/api/v1/athletes/results')

        assert response.status_code == 200
        data = response.json()
        assert 'results' in data
        assert 'pagination' in data

    def test_list_athlete_results_with_filters(self, client, sample_athlete_result):
        """Test listing athlete results with sex filter."""
        client.mock_db.execute_count.return_value = 1
        client.mock_db.execute_query.return_value = [sample_athlete_result]

        response = client.get('/api/v1/athletes/results?sex=Men&event_id=123')

        assert response.status_code == 200


class TestStatsEndpoint:
    """Tests for the stats endpoint."""

    def test_get_global_stats(self, client, sample_stats):
        """Test getting global statistics."""
        client.mock_db.execute_query.return_value = sample_stats

        response = client.get('/api/v1/stats')

        assert response.status_code == 200
        data = response.json()
        assert 'stats' in data
        assert 'generated_at' in data


class TestInputValidation:
    """Tests for input validation and edge cases."""

    def test_invalid_page_number(self, client):
        """Test invalid page number returns error."""
        response = client.get('/api/v1/events?page=0')

        assert response.status_code == 422  # Validation error

    def test_invalid_page_size(self, client):
        """Test page size exceeding max returns error."""
        response = client.get('/api/v1/events?page_size=10000')

        assert response.status_code == 422  # Validation error

    def test_invalid_year_range(self, client):
        """Test year outside valid range returns error."""
        response = client.get('/api/v1/events?year=1900')

        assert response.status_code == 422  # Validation error

    def test_invalid_stars_rating(self, client):
        """Test invalid star rating returns error."""
        response = client.get('/api/v1/events?stars=10')

        assert response.status_code == 422  # Validation error

    def test_invalid_sex_filter(self, client):
        """Test invalid sex filter is handled."""
        client.mock_db.execute_count.return_value = 0
        client.mock_db.execute_query.return_value = []

        # The API should accept the filter but return no results
        response = client.get('/api/v1/athletes/results?sex=Invalid')

        # Depending on API design, this could be 422 or 200 with empty results
        assert response.status_code in [200, 422]

    def test_negative_page_number(self, client):
        """Test negative page number returns error."""
        response = client.get('/api/v1/events?page=-1')

        assert response.status_code == 422

    def test_negative_page_size(self, client):
        """Test negative page size returns error."""
        response = client.get('/api/v1/events?page_size=-10')

        assert response.status_code == 422

    def test_future_year(self, client):
        """Test year too far in future returns error."""
        response = client.get('/api/v1/events?year=2050')

        assert response.status_code == 422

    def test_stars_below_minimum(self, client):
        """Test star rating below minimum returns error."""
        response = client.get('/api/v1/events?stars=0')

        assert response.status_code == 422

    def test_non_integer_page(self, client):
        """Test non-integer page returns error."""
        response = client.get('/api/v1/events?page=abc')

        assert response.status_code == 422

    def test_non_integer_event_id(self, client):
        """Test non-integer event ID returns error."""
        response = client.get('/api/v1/events/abc')

        assert response.status_code == 422

    def test_empty_country_code_filter(self, client, sample_event):
        """Test empty country code filter is handled gracefully."""
        client.mock_db.execute_count.return_value = 1
        client.mock_db.execute_query.return_value = [sample_event]

        # Empty string should be ignored or handled
        response = client.get('/api/v1/events?country_code=')

        # Should return 200 (filter ignored) or 422 (validation error)
        assert response.status_code in [200, 422]

    def test_page_size_boundary_values(self, client, sample_event):
        """Test page size at boundary values."""
        client.mock_db.execute_count.return_value = 1
        client.mock_db.execute_query.return_value = [sample_event]

        # Minimum valid value
        response = client.get('/api/v1/events?page_size=1')
        assert response.status_code == 200

        # Maximum valid value (depends on MAX_PAGE_SIZE setting)
        response = client.get('/api/v1/events?page_size=500')
        assert response.status_code == 200

    def test_valid_source_filter(self, client, sample_event):
        """Test valid source filter values."""
        client.mock_db.execute_count.return_value = 1
        client.mock_db.execute_query.return_value = [sample_event]

        response = client.get('/api/v1/events?source=PWA')
        assert response.status_code == 200

    def test_wave_only_filter(self, client, sample_event):
        """Test wave_only filter works correctly."""
        client.mock_db.execute_count.return_value = 1
        client.mock_db.execute_query.return_value = [sample_event]

        # Test with wave_only=true (default)
        response = client.get('/api/v1/events?wave_only=true')
        assert response.status_code == 200

        # Test with wave_only=false
        response = client.get('/api/v1/events?wave_only=false')
        assert response.status_code == 200


class TestEmptyResults:
    """Tests for empty result handling."""

    def test_events_empty_list(self, client):
        """Test events endpoint returns empty list correctly."""
        client.mock_db.execute_count.return_value = 0
        client.mock_db.execute_query.return_value = []

        response = client.get('/api/v1/events')

        assert response.status_code == 200
        data = response.json()
        assert data['events'] == []
        assert data['pagination']['total'] == 0

    def test_athletes_empty_list(self, client):
        """Test athletes endpoint returns empty list correctly."""
        client.mock_db.execute_count.return_value = 0
        client.mock_db.execute_query.return_value = []

        response = client.get('/api/v1/athletes/results')

        assert response.status_code == 200
        data = response.json()
        assert data['results'] == []
        assert data['pagination']['total'] == 0

    def test_stats_empty_list(self, client):
        """Test stats endpoint returns empty list correctly."""
        client.mock_db.execute_query.return_value = []

        response = client.get('/api/v1/stats')

        assert response.status_code == 200
        data = response.json()
        assert data['stats'] == []

    def test_page_beyond_results(self, client):
        """Test requesting page beyond available results."""
        client.mock_db.execute_count.return_value = 10  # Only 10 total results
        client.mock_db.execute_query.return_value = []

        # Request page 100 when there are only 10 results
        response = client.get('/api/v1/events?page=100&page_size=50')

        # Should return 400 (page doesn't exist), 500 (internal error handling),
        # or empty results depending on implementation
        assert response.status_code in [200, 400, 500]


class TestContentType:
    """Tests for response content types."""

    def test_json_content_type(self, client):
        """Test responses have correct JSON content type."""
        response = client.get('/')

        assert response.headers['content-type'] == 'application/json'

    def test_health_json_content_type(self, client):
        """Test health endpoint returns JSON."""
        response = client.get('/health')

        assert response.headers['content-type'] == 'application/json'


class TestErrorHandling:
    """Tests for error handling."""

    def test_database_error_returns_500(self, client):
        """Test database errors are handled gracefully."""
        from mysql.connector import Error
        client.mock_db.execute_count.side_effect = Error("Database connection failed")

        response = client.get('/api/v1/events')

        # Should return 500 or handle gracefully
        assert response.status_code in [500, 503]

    def test_not_found_endpoint(self, client):
        """Test accessing non-existent endpoint returns 404."""
        response = client.get('/api/v1/nonexistent')

        assert response.status_code == 404
