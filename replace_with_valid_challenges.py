#!/usr/bin/env python3
"""
Replace existing challenges with valid interview-grade challenges.
Remove invalid challenges and update the challenge list.
"""

import json
import re
from pathlib import Path
from collections import defaultdict

# Parse the valid challenges from the user's list
VALID_CHALLENGES = {
    'angular': [
        'angular-11-click-counter', 'angular-12-todo-item-component', 'angular-13-service-creation',
        'angular-13-showhide-toggle', 'angular-14-http-request', 'angular-14-parent-child-communication',
        'angular-15-reactive-forms', 'angular-15-simple-form-validation', 'angular-16-array-filtering',
        'angular-16-form-validation', 'angular-17-button-variants', 'angular-18-image-gallery',
        'angular-19-accordion-component', 'angular-2-propsinput-binding', 'angular-20-tab-component',
        'angular-21-custom-hookscomposables', 'angular-22-http-get-request', 'angular-23-http-post-with-form',
        'angular-24-error-handling', 'angular-25-loading-states', 'angular-26-routing-setup',
        'angular-27-route-parameters', 'angular-28-nested-routes', 'angular-29-route-guards',
        'angular-3-event-handling', 'angular-3-property-binding', 'angular-30-form-validation-advanced',
        'angular-31-debounced-search', 'angular-32-infinite-scroll', 'angular-33-pagination',
        'angular-34-modaldialog-component', 'angular-35-dropdown-with-outside-click',
        'angular-36-context-apiprovide-inject', 'angular-38-lazy-loading', 'angular-39-code-splitting',
        'angular-4-event-binding', 'angular-4-state-management', 'angular-40-local-storage-integration',
        'angular-41-websocket-connection', 'angular-42-file-upload', 'angular-43-drag-and-drop',
        'angular-44-multi-step-form', 'angular-45-real-time-validation',
        'angular-46-state-management-reduxngrx', 'angular-47-state-with-async-actions',
        'angular-48-optimistic-updates', 'angular-49-memoizationperformance', 'angular-5-list-rendering',
        'angular-5-two-way-binding', 'angular-50-virtual-scrolling', 'angular-51-component-testing',
        'angular-52-integration-testing', 'angular-53-e2e-testing-basics', 'angular-54-custom-hooks-testing',
        'angular-55-performance-profiling', 'angular-56-code-splitting-strategy', 'angular-57-ssr-implementation',
        'angular-58-pwa-setup', 'angular-59-service-workers', 'angular-6-conditional-rendering',
        'angular-6-ngfor-directive', 'angular-60-accessibility-aria', 'angular-61-keyboard-navigation',
        'angular-62-internationalization-i18n', 'angular-63-theme-switching',
        'angular-64-advanced-typescript-patterns', 'angular-65-error-boundary',
        'angular-66-micro-frontend-architecture', 'angular-67-module-federation',
        'angular-68-design-system-creation', 'angular-69-custom-cli-tool', 'angular-7-form-input-handling',
        'angular-7-ngif-directive', 'angular-70-build-optimization', 'angular-71-bundle-analysis',
        'angular-72-monorepo-setup', 'angular-73-custom-webpackvite-config',
        'angular-74-advanced-state-patterns', 'angular-75-performance-monitoring',
        'angular-8-component-input', 'angular-8-two-way-binding', 'angular-9-component-lifecycle',
        'angular-9-component-output'
    ],
    'go': [f'go-{i:02d}-{name}' for i, name in enumerate([
        'hello-go-api', 'go-basics', 'variables-and-types', 'functions', 'structs', 'pointers',
        'slices', 'maps', 'range-loops', 'if-else', 'switch', 'defer', 'errors', 'http-server',
        'handlers', 'routing', 'request-parsing', 'response-writing', 'json-encoding',
        'basic-testing', 'goroutines', 'channels', 'select-statement', 'mutex', 'waitgroups',
        'context', 'middleware', 'request-validation', 'error-handling', 'custom-errors',
        'database-connection', 'sql-queries', 'prepared-statements', 'transactions', 'orm-gorm',
        'migrations', 'query-builder', 'pagination', 'jwt-authentication', 'password-hashing',
        'file-upload', 'environment-config', 'logging', 'testing-with-mocks', 'table-driven-tests',
        'concurrency-patterns', 'worker-pools', 'pipeline-pattern', 'fan-out-fan-in',
        'context-cancellation', 'graceful-shutdown', 'connection-pooling', 'query-optimization',
        'caching', 'rate-limiting', 'circuit-breaker', 'retry-logic', 'grpc-service',
        'protocol-buffers', 'service-discovery', 'health-checks', 'metrics', 'tracing',
        'profiling', 'performance-tuning', 'microservices-design', 'event-driven-architecture',
        'message-queues', 'cqrs-implementation', 'event-sourcing', 'service-mesh',
        'kubernetes-deployment', 'helm-charts', 'multi-region-setup', 'chaos-engineering'
    ], 1)],
    'java': [f'java-{i:02d}-{name}' for i, name in enumerate([
        'hello-spring-boot', 'java-basics', 'classes-and-objects', 'inheritance', 'interfaces',
        'collections', 'streams', 'lambda-expressions', 'exception-handling', 'file-i-o',
        'rest-controller', 'request-mapping', 'path-variables', 'request-parameters', 'request-body',
        'response-entity', 'spring-boot-application', 'configuration-properties', 'component-scanning',
        'junit-testing', 'spring-data-jpa', 'entity-mapping', 'repository-pattern', 'query-methods',
        'custom-queries', 'pagination', 'sorting', 'specifications', 'transactions', 'bean-validation',
        'custom-validators', 'exception-handling', 'global-exception-handler', 'dto-pattern',
        'mapstruct', 'spring-security', 'authentication', 'authorization', 'jwt-implementation',
        'password-encoding', 'method-security', 'file-upload', 'async-processing', 'scheduled-tasks',
        'caching', 'complex-jpa-queries', 'query-optimization', 'database-indexing', 'n+1-problem',
        'batch-processing', 'event-driven-design', 'spring-cloud-config', 'service-discovery',
        'circuit-breaker', 'api-gateway', 'distributed-tracing', 'monitoring', 'load-balancing',
        'rate-limiting', 'oauth2-server', 'multi-tenancy', 'graphql-integration', 'websocket',
        'reactive-programming', 'performance-tuning', 'microservices-architecture',
        'message-driven-architecture', 'cqrs-pattern', 'event-sourcing', 'saga-pattern',
        'service-mesh', 'container-orchestration', 'blue-green-deployment', 'chaos-engineering',
        'multi-region-deployment'
    ], 1)],
    'nodejs': [f'nodejs-{i:02d}-{name}' for i, name in enumerate([
        'hello-express-api', 'typescript-basics', 'functions-and-types', 'async-await',
        'promise-handling', 'express-routing', 'middleware-basics', 'request-validation',
        'response-formatting', 'error-handling', 'environment-config', 'file-operations',
        'json-parsing', 'query-parameters', 'path-parameters', 'post-request-handling',
        'express-router', 'static-files', 'cors-setup', 'basic-testing-with-jest',
        'database-connection', 'mongoose-models', 'crud-operations', 'model-relationships',
        'query-building', 'pagination', 'sorting-and-filtering', 'authentication-middleware',
        'jwt-tokens', 'password-hashing', 'session-management', 'file-upload', 'image-processing',
        'email-service', 'rate-limiting', 'request-logging', 'error-middleware', 'validation-schemas',
        'database-transactions', 'query-optimization', 'caching-with-redis', 'websocket-setup',
        'real-time-events', 'api-versioning', 'integration-testing', 'complex-queries',
        'aggregation-pipeline', 'database-indexing', 'transaction-patterns', 'event-emitters',
        'streams-api', 'worker-threads', 'clustering', 'memory-management', 'performance-optimization',
        'load-balancing', 'health-checks', 'graceful-shutdown', 'circuit-breaker', 'retry-logic',
        'oauth2-flow', 'refresh-tokens', 'rbac-implementation', 'multi-tenancy', 'graphql-api',
        'microservices-architecture', 'message-queue-integration', 'event-driven-design',
        'api-gateway', 'service-discovery', 'distributed-tracing', 'monitoring-setup',
        'blue-green-deployment', 'container-orchestration', 'multi-region-setup'
    ], 1)],
    'python': [f'python-{i:02d}-{name}' for i, name in enumerate([
        'hello-flask-api', 'variables-and-data-types', 'functions-and-return-values',
        'lists-and-loops', 'dictionaries-and-json', 'string-manipulation', 'file-reading',
        'exception-handling', 'list-comprehensions', 'flask-route-parameters',
        'request-data-parsing', 'response-status-codes', 'flask-blueprints', 'environment-variables',
        'basic-validation', 'json-response-format', 'query-parameters', 'simple-crud-operations',
        'error-messages', 'basic-testing-with-pytest', 'django-models', 'model-relationships',
        'django-views', 'django-rest-framework-setup', 'serializers', 'viewsets', 'authentication',
        'permissions', 'pagination', 'filtering', 'searching', 'ordering', 'database-migrations',
        'custom-validators', 'file-uploads', 'image-processing', 'email-sending', 'celery-tasks',
        'redis-caching', 'middleware', 'custom-exceptions', 'signals', 'many-to-many-relationships',
        'api-versioning', 'integration-testing', 'complex-queries-with-orm', 'query-optimization',
        'database-indexing', 'n+1-query-problem', 'custom-managers', 'aggregation-and-annotation',
        'transaction-management', 'websocket-integration', 'graphql-with-graphene', 'rate-limiting',
        'oauth2-integration', 'jwt-refresh-tokens', 'role-based-access-control', 'multi-tenancy',
        'background-job-scheduling', 'full-text-search', 'api-documentation', 'load-testing',
        'database-replication', 'monitoring-and-logging', 'microservices-architecture',
        'event-driven-architecture', 'cqrs-pattern', 'api-gateway', 'service-mesh',
        'distributed-tracing', 'circuit-breaker-pattern', 'blue-green-deployment',
        'chaos-engineering', 'multi-region-deployment'
    ], 1)],
    'react': [
        'react-1-list-rendering-with-keys', 'react-10-props-drilling', 'react-11-click-counter',
        'react-11-render-list-from-json', 'react-12-simple-form-no-validation', 'react-12-todo-item-component',
        'react-13-image-gallery-grid', 'react-13-showhide-toggle', 'react-14-active-tab-highlighting',
        'react-14-parent-child-communication', 'react-15-display-current-datetime',
        'react-15-simple-form-validation', 'react-16-array-filtering', 'react-16-search-filter',
        'react-17-button-variants', 'react-17-fetch-and-display-users', 'react-18-image-gallery',
        'react-18-todo-list-addremove', 'react-19-accordion-component', 'react-2-counter-component',
        'react-2-propsinput-binding', 'react-20-tab-component', 'react-20-tabs-with-content',
        'react-21-custom-hookscomposables', 'react-21-modal-dialog', 'react-22-http-get-request',
        'react-22-pagination', 'react-23-form-with-validation', 'react-23-http-post-with-form',
        'react-24-dropdown-select', 'react-24-error-handling', 'react-25-loading-states',
        'react-25-star-rating-component', 'react-26-color-picker', 'react-26-routing-setup',
        'react-27-image-carouselslider', 'react-27-route-parameters', 'react-28-nested-routes',
        'react-28-timercountdown', 'react-29-route-guards', 'react-29-stopwatch',
        'react-3-event-handling', 'react-3-showhide-toggle', 'react-30-form-validation-advanced',
        'react-30-multi-select-checkbox', 'react-31-debounced-search', 'react-31-tooltip-component',
        'react-32-breadcrumb-navigation', 'react-32-infinite-scroll', 'react-33-pagination',
        'react-33-tag-input', 'react-34-character-counter', 'react-34-modaldialog-component',
        'react-35-dropdown-with-outside-click', 'react-35-progress-bar',
        'react-36-context-apiprovide-inject', 'react-36-debounced-search-with-api',
        'react-37-infinite-scroll', 'react-38-auto-complete', 'react-38-lazy-loading',
        'react-39-code-splitting', 'react-39-shopping-cart', 'react-4-controlled-input',
        'react-4-state-management', 'react-40-local-storage-integration', 'react-40-multi-step-form',
        'react-41-drag-and-drop-list', 'react-41-websocket-connection', 'react-42-file-upload',
        'react-42-file-upload-with-preview', 'react-43-drag-and-drop', 'react-43-real-time-search-highlight',
        'react-44-custom-hook-usefetch', 'react-44-multi-step-form', 'react-45-custom-hook-uselocalstorage',
        'react-45-real-time-validation', 'react-46-context-api-theme-switcher',
        'react-46-state-management-reduxngrx', 'react-47-optimistic-ui-updates',
        'react-47-state-with-async-actions', 'react-48-optimistic-updates', 'react-48-virtualized-list',
        'react-49-form-builder', 'react-49-memoizationperformance', 'react-5-button-click-counter',
        'react-5-list-rendering', 'react-50-data-table-with-sortfilter', 'react-50-virtual-scrolling',
        'react-51-component-testing', 'react-51-compound-component-pattern', 'react-52-integration-testing',
        'react-52-render-props-pattern', 'react-53-e2e-testing-basics', 'react-53-higher-order-component',
        'react-54-custom-form-library', 'react-54-custom-hooks-testing', 'react-55-performance-profiling',
        'react-55-state-machine', 'react-56-code-splitting-strategy', 'react-56-lazy-loading-with-code-splitting',
        'react-57-error-boundary', 'react-57-ssr-implementation', 'react-58-portal-modal-with-focus-trap',
        'react-58-pwa-setup', 'react-59-recursive-component', 'react-59-service-workers',
        'react-6-conditional-rendering', 'react-6-greeting-component', 'react-60-accessibility-aria',
        'react-60-custom-reconciliation', 'react-61-keyboard-navigation', 'react-62-internationalization-i18n',
        'react-63-theme-switching', 'react-64-advanced-typescript-patterns', 'react-65-error-boundary',
        'react-66-micro-frontend-architecture', 'react-67-module-federation', 'react-68-design-system-creation',
        'react-69-custom-cli-tool', 'react-7-conditional-class-names', 'react-7-form-input-handling',
        'react-70-build-optimization', 'react-71-bundle-analysis', 'react-72-monorepo-setup',
        'react-73-custom-webpackvite-config', 'react-74-advanced-state-patterns',
        'react-75-performance-monitoring', 'react-8-disable-button-on-click', 'react-8-two-way-binding',
        'react-9-component-lifecycle', 'react-9-multiple-state-variables'
    ],
    'react-typescript': [
        'react-ts-11-click-counter', 'react-ts-12-todo-item-component', 'react-ts-13-showhide-toggle',
        'react-ts-14-parent-child-communication', 'react-ts-15-simple-form-validation',
        'react-ts-16-array-filtering', 'react-ts-17-button-variants', 'react-ts-18-image-gallery',
        'react-ts-19-accordion-component', 'react-ts-2-propsinput-binding', 'react-ts-20-tab-component',
        'react-ts-21-custom-hookscomposables', 'react-ts-22-http-get-request', 'react-ts-23-http-post-with-form',
        'react-ts-24-error-handling', 'react-ts-25-loading-states', 'react-ts-26-routing-setup',
        'react-ts-27-route-parameters', 'react-ts-28-nested-routes', 'react-ts-29-route-guards',
        'react-ts-3-event-handling', 'react-ts-30-form-validation-advanced', 'react-ts-31-debounced-search',
        'react-ts-32-infinite-scroll', 'react-ts-33-pagination', 'react-ts-34-modaldialog-component',
        'react-ts-35-dropdown-with-outside-click', 'react-ts-36-context-apiprovide-inject',
        'react-ts-38-lazy-loading', 'react-ts-39-code-splitting', 'react-ts-4-state-management',
        'react-ts-40-local-storage-integration', 'react-ts-41-websocket-connection', 'react-ts-42-file-upload',
        'react-ts-43-drag-and-drop', 'react-ts-44-multi-step-form', 'react-ts-45-real-time-validation',
        'react-ts-46-state-management-reduxngrx', 'react-ts-47-state-with-async-actions',
        'react-ts-48-optimistic-updates', 'react-ts-49-memoizationperformance', 'react-ts-5-list-rendering',
        'react-ts-50-virtual-scrolling', 'react-ts-51-component-testing', 'react-ts-52-integration-testing',
        'react-ts-53-e2e-testing-basics', 'react-ts-54-custom-hooks-testing', 'react-ts-55-performance-profiling',
        'react-ts-56-code-splitting-strategy', 'react-ts-57-ssr-implementation', 'react-ts-58-pwa-setup',
        'react-ts-59-service-workers', 'react-ts-6-conditional-rendering', 'react-ts-60-accessibility-aria',
        'react-ts-61-keyboard-navigation', 'react-ts-62-internationalization-i18n', 'react-ts-63-theme-switching',
        'react-ts-64-advanced-typescript-patterns', 'react-ts-65-error-boundary',
        'react-ts-66-micro-frontend-architecture', 'react-ts-67-module-federation',
        'react-ts-68-design-system-creation', 'react-ts-69-custom-cli-tool', 'react-ts-7-form-input-handling',
        'react-ts-70-build-optimization', 'react-ts-71-bundle-analysis', 'react-ts-72-monorepo-setup',
        'react-ts-73-custom-webpackvite-config', 'react-ts-74-advanced-state-patterns',
        'react-ts-75-performance-monitoring', 'react-ts-8-two-way-binding', 'react-ts-9-component-lifecycle'
    ]
}

def get_challenge_id_from_filename(filename):
    """Extract challenge ID from filename."""
    return filename.replace('.json', '')

def main():
    """Remove invalid challenges and keep only valid ones."""
    base_dir = Path(__file__).parent
    domains = ['react', 'react-typescript', 'angular', 'nodejs', 'python', 'java', 'go', 'swift']
    
    total_removed = 0
    total_kept = 0
    
    for domain in domains:
        if domain == 'swift':
            # User said we can ignore Swift, but leaving decision to me
            # I'll keep Swift for now but you can remove this check if you want to delete them
            print(f"\nSkipping Swift (as per user preference)...")
            continue
            
        domain_path = base_dir / domain
        if not domain_path.exists():
            continue
        
        valid_ids = set(VALID_CHALLENGES.get(domain, []))
        print(f"\nProcessing {domain}...")
        print(f"Valid challenges: {len(valid_ids)}")
        
        json_files = list(domain_path.glob('*.json'))
        
        for json_file in json_files:
            challenge_id = get_challenge_id_from_filename(json_file.name)
            
            if challenge_id not in valid_ids:
                # Remove invalid challenge
                try:
                    json_file.unlink()
                    total_removed += 1
                    print(f"  Removed: {json_file.name}")
                except Exception as e:
                    print(f"  Error removing {json_file.name}: {e}")
            else:
                total_kept += 1
    
    print(f"\nDone!")
    print(f"Removed: {total_removed} invalid challenges")
    print(f"Kept: {total_kept} valid challenges")

if __name__ == '__main__':
    main()

