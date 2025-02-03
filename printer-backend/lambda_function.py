import boto3
import json
from decimal import Decimal

# Creates a DynamoDB resource object, allowing access to DynamoDB tables.
dynamodb = boto3.resource("dynamodb")
# Creates an IoT Data client to interact with AWS IoT Core
client = boto3.client("iot-data")
# Accesses the DynamoDB table where device-specific data (such as thresholds and event counts) is stored.
table = dynamodb.Table('PrinterProfiles')

def lambda_handler(event, context):
    # Normalize case for PrinterId
    device_id = event.get("PrinterId").capitalize()
    sensor_value = event["data"]["value"]

    # Fetch the device profile from DynamoDB based on PrinterId
    response = table.get_item(Key={"PrinterId": device_id})

    if "Item" in response:
        device_profile = response["Item"]
        print(f"Device profile fetched: {device_profile}")

        # Access the nested thresholds within the 'Thresholds' map
        lower_threshold = float(device_profile["Thresholds"]["Lower"])
        upper_threshold = float(device_profile["Thresholds"]["Upper"])
        time_window = int(device_profile["Window"])

        # Log for debugging
        print(f"Processing {device_id} with sensor value: {sensor_value}")
        print(f"Current OutOfBoundsCount: {device_profile['OutOfBoundsCount']}")
        print(f"EventCount before processing: {device_profile.get('EventCount', 0)}")

        # Check if the sensor value is outside the acceptable range defined by the thresholds
        is_out_of_bounds = sensor_value < lower_threshold or sensor_value > upper_threshold

        # Increment or reset OutOfBoundsCount
        if is_out_of_bounds:
            device_profile["OutOfBoundsCount"] = int(device_profile.get("OutOfBoundsCount", 0)) + 1
        else:
            device_profile["OutOfBoundsCount"] = 0

        # If OutOfBoundsCount exceeds time_window, trigger an anomaly event
        if device_profile["OutOfBoundsCount"] >= time_window:
            device_profile["EventCount"] = int(device_profile.get("EventCount", 0)) + 1
            device_profile["OutOfBoundsCount"] = 0  # Reset after event triggered
            iot_republish(device_id, device_profile)

        # Atomic update to DynamoDB to update only OutOfBoundsCount and EventCoun
        response = table.update_item(
            Key={"PrinterId": device_id},
            UpdateExpression="SET OutOfBoundsCount = :oob, EventCount = :ec",
            ExpressionAttributeValues={
                ":oob": device_profile["OutOfBoundsCount"],
                ":ec": device_profile["EventCount"]
            },
            ReturnValues="UPDATED_NEW"
        )
        print(f"Update response: {response}")

    # Optionally, generate the output after processing
    print("Current device processing complete. Generating output:")
    generate_output()  # Call the output generation function
    
    return {"status": "processed"}

def iot_republish(device_id, new_record):
    # Convert Decimal fields to float/int before publishing
    event_count = int(new_record["EventCount"])
    payload = json.dumps({"PrinterId": device_id, "events": event_count})
    response = client.publish(topic="anom/pred", qos=1, payload=payload)
    return

# Output generation function to scan the DynamoDB table and print device event counts
def generate_output():
    # Scan the table to get all items (devices)
    response = table.scan()
    devices = response.get('Items', [])
    
    # Sort devices by EventCount in descending order
    sorted_devices = sorted(devices, key=lambda d: int(d['EventCount']), reverse=True)
    
    # Generate output: list of tuples (PrinterId, EventCount)
    output = [(device['PrinterId'], int(device['EventCount'])) for device in sorted_devices]
    
    # Log the output for debugging and visibility in CloudWatch logs
    print("Sorted output (PrinterId, EventCount):")
    for device_id, event_count in output:
        print(f"{device_id}, {event_count}")
    
    return output