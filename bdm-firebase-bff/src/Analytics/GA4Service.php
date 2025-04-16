<?php

namespace BDM\FirebaseBFF\Analytics;

use Google\Analytics\Data\V1beta\Client\BetaAnalyticsDataClient;
use Google\Analytics\Data\V1beta\RunReportRequest;
use Google\Analytics\Data\V1beta\DateRange;
use Google\Analytics\Data\V1beta\Dimension;
use Google\Analytics\Data\V1beta\Metric;

class GA4Service
{
    private string $credentialsPath;
    private string $propertyId;

    public function __construct(string $credentialsPath, string $propertyId)
    {
        $this->credentialsPath = $credentialsPath;
        $this->propertyId = $propertyId;
    }

    public function fetchAnalytics(): array
    {
        $credentialsJson = file_get_contents($this->credentialsPath);
        $credentialsArray = json_decode($credentialsJson, true);
    
        $client = new BetaAnalyticsDataClient([
            'credentials' => $credentialsArray,
        ]);
    
        $dateRange = new DateRange();
        $dateRange->setStartDate('30daysAgo');
        $dateRange->setEndDate('yesterday');
    
        $request = new RunReportRequest();
        $request->setProperty("properties/{$this->propertyId}");
        $request->setDateRanges([$dateRange]);
        $request->setMetrics([
            new Metric(['name' => 'activeUsers']),
        ]);
        $request->setDimensions([
            new Dimension(['name' => 'eventName']),
        ]);
    
        try {
            $response = $client->runReport($request);
    
            $results = [];
    
            foreach ($response->getRows() as $row) {
                $results[] = [
                    'date' => $row->getDimensionValues()[0]->getValue(),
                    'sessions' => $row->getMetricValues()[0]->getValue(),
                    'activeUsers' => $row->getMetricValues()[0]->getValue(),
                ];
            }
    
            return $results;
        } catch (\Throwable $e) {
            return [
                'error' => 'Erro ao consultar dados do GA4: ' . $e->getMessage(),
            ];
        }
    }
}
