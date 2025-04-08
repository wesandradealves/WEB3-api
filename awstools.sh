# create fila comum
aws --endpoint-url http://localhost:4566 sqs create-queue --queue-name dev-dashboard-transfer-processing-queue --attributes FifoQueue=true

# list
aws --endpoint-url http://localhost:4566 sqs list-queues

# create fifo
aws --endpoint-url http://localhost:4566 sqs create-queue --queue-name dev-dashboard-transfer-processing-queue.fifo --attributes FifoQueue=true,ContentBasedDeduplication=true

# delete
aws --endpoint-url http://localhost:4566 sqs delete-queue --queue-url https://sqs.us-east-1.amazonaws.com/00000000000/teste_fila.fifo



