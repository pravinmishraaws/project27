# Import required modules
import time  # Provides time-related functions like sleep to introduce delays
import json  # Enables working with JSON data
import argparse  # Allows handling command-line arguments
import boto3  # AWS SDK for Python to interact with AWS services

# Function to emit JSON data to an AWS IoT topic
def emit_json_to_iot(topic, json_file):
    '''
    This function reads a JSON file and sends each entry (observation) 
    as a message to a specified AWS IoT topic with a 0.1-second pause between messages.

    Args:
    - topic (str): The AWS IoT topic where messages will be published.
    - json_file (str): Path to the JSON file containing the data to be sent.

    Example usage from the command line:
    $ python emit_json_data.py anom/detect SF36.json
    '''
    
    # Create an AWS IoT client to interact with the AWS IoT service
    client = boto3.client("iot-data")

    # Open the JSON file and load its content
    with open(json_file) as f:
        data = json.load(f)  # Load the JSON file into a Python object (a list of observations)

    # Loop through each observation (data entry) in the JSON file
    for observation in data:
        # Publish each observation to the given IoT topic
        # - topic: The target IoT topic
        # - qos=1: Quality of Service, ensuring that the message is delivered at least once
        # - payload: The payload is the observation converted back into a JSON string (json.dumps)
        response = client.publish(topic=topic, qos=1, payload=json.dumps(observation))

        # Add a small delay (0.30 seconds) between each message to avoid overloading the IoT system
        time.sleep(0.30)

        # Print each emitted observation for tracking purposes
        print('Emitted observation: ' + str(observation))

# Main block to handle command-line arguments and run the script
if __name__ == '__main__':
    # Creates an argument parser for parsing command-line arguments.
    parser = argparse.ArgumentParser()

    # Defines two required command-line arguments
    # - topic: The AWS IoT topic to publish messages to
    # - json_file: The path to the JSON file containing the data to emit
    parser.add_argument("topic", help="The IoT topic to publish to (e.g., anom/detect)")
    parser.add_argument("json_file", help="The JSON file containing data to send to AWS IoT")

    # Parses the command-line arguments and stores them in the args object.
    args = parser.parse_args()

    # Call the emit_json_to_iot function, passing the topic and JSON file from the command-line arguments
    emit_json_to_iot(args.topic, args.json_file)