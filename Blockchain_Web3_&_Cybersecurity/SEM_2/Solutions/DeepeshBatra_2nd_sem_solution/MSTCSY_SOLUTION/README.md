#i have used chatgpt and deepseek of understandable 
#code: both 
#documentation : chatgpt 
#the url is : https://chatgpt.com/share/68987777-f5f4-8012-9ebb-780ae27e95ce
#and https://chat.deepseek.com/a/chat/s/4fb68579-e74b-4290-ac9d-2646f64a1d14
#access on : August 10,2025


# MSTCSY Solution - Suspicious IP Detection System

## Overview

This project implements a security monitoring system that detects suspicious IP addresses based on login attempt patterns. The system analyzes log data to identify IP addresses that have made more than 5 unsuccessful login attempts within a 10-minute (600-second) time window.

## Problem Statement

The system addresses the challenge of identifying potentially malicious IP addresses by analyzing authentication logs. An IP address is considered suspicious if it has more than 5 failed login attempts within a 10-minute period, which could indicate brute force attacks or other security threats.

## Features

- **Real-time Log Analysis**: Processes CSV-formatted log data efficiently
- **Sliding Window Detection**: Uses a 10-minute sliding window to track login attempts
- **Smart Status Handling**: Automatically resets failure counts when successful logins occur
- **Binary Search Optimization**: Efficiently finds failures within the time window
- **Robust Error Handling**: Gracefully handles malformed log entries and invalid data
- **Sorted Output**: Returns suspicious IP addresses in alphabetical order

## Technical Implementation

### Core Algorithm

The solution uses a sophisticated approach combining:
- **Hash Map Storage**: `ip_failures` dictionary to track failure timestamps for each IP
- **Sliding Window Logic**: 600-second (10-minute) window calculation
- **Binary Search**: Efficiently locates failures within the current time window
- **Automatic Cleanup**: Removes IPs from monitoring when successful logins occur

### Data Structure

```python
ip_failures = {
    "IP_ADDRESS": [sorted_timestamps_of_failures]
}
```

### Time Complexity
- **Overall**: O(n log k) where n is the number of log entries and k is the maximum failures per IP
- **Per Entry**: O(log k) for binary search operations
- **Space Complexity**: O(n) for storing IP failure histories

## File Structure

```
mstcsy_solution/
├── mstcsy_solution.py    # Main Python script
├── Log_data.csv          # Sample log data for testing
└── README.md             # This documentation file
```

## Input Format

The system expects CSV data with the following structure:
```csv
TIMESTAMP,IP_ADDRESS,STATUS
1723005000,192.168.1.10,FAIL
1723005010,192.168.1.10,SUCCESS
```

### Field Descriptions

- **TIMESTAMP**: Unix timestamp (integer) representing the login attempt time
- **IP_ADDRESS**: IPv4 or IPv6 address of the client
- **STATUS**: Login result - either "SUCCESS" or "FAIL" (case-insensitive)

## Usage

### Basic Usage

```python
from mstcsy_solution import process_csv_file

# Process CSV data
csv_content = """TIMESTAMP,IP_ADDRESS,STATUS
1723005000,192.168.1.10,FAIL
1723005010,192.168.1.10,FAIL"""

suspicious_ips = process_csv_file(csv_content)
print(suspicious_ips)
```

### Direct Function Call

```python
from mstcsy_solution import find_suspicious_ips

# Process list of log entries
logs = [
    "1723005000,192.168.1.10,FAIL",
    "1723005010,192.168.1.10,FAIL"
]

suspicious_ips = find_suspicious_ips(logs)
```

### Command Line Execution

```bash
python mstcsy_solution.py
```

## Example Output

For the provided sample data, the system detects the following suspicious IP addresses:

```
Suspicious IP addresses detected:
- 198.51.100.12
- 203.0.113.55
- 10.0.0.42
```

## Algorithm Details

### 1. Log Parsing
- Skips header rows automatically
- Handles malformed entries gracefully
- Extracts timestamp, IP, and status information

### 2. Failure Tracking
- Maintains sorted list of failure timestamps for each IP
- Automatically sorts new timestamps to maintain order
- Resets failure history when successful login occurs

### 3. Suspicious IP Detection
- Calculates 10-minute window boundaries
- Uses binary search to find failures within the window
- Counts failures in the current window
- Flags IPs exceeding the 5-failure threshold

### 4. Output Generation
- Collects all suspicious IP addresses
- Returns alphabetically sorted list
- Handles edge cases and errors gracefully

## Error Handling

The system includes comprehensive error handling for:
- **Invalid Timestamps**: Non-integer timestamp values
- **Malformed Entries**: Incorrect CSV format or missing fields
- **Invalid Status Values**: Non-standard status codes
- **Data Type Errors**: Attribute errors during processing

## Performance Considerations

- **Memory Efficient**: Only stores necessary failure timestamps
- **Fast Lookup**: O(log k) binary search for window calculations
- **Automatic Cleanup**: Removes successful IPs from monitoring
- **Sorted Maintenance**: Efficient timestamp sorting and management

## Testing

The solution includes built-in test data that demonstrates:
- Multiple failure scenarios
- Success status handling
- Edge case processing
- Output validation

## Dependencies

- **Python 3.6+**: For type hints and modern Python features
- **csv**: Built-in Python module for CSV processing
- **io.StringIO**: For string-based CSV handling
- **typing.List**: For type annotations

## Future Enhancements

Potential improvements could include:
- **Configurable Thresholds**: Adjustable failure limits and time windows
- **Real-time Streaming**: Process logs as they arrive
- **Database Integration**: Store results in persistent storage
- **Alert System**: Real-time notifications for suspicious activity
- **Machine Learning**: Pattern recognition for advanced threat detection

## Author

This solution was developed as part of the MSTCSY coursework, with assistance from AI tools for code understanding and documentation.

## License

This project is created for educational purposes as part of academic coursework.
