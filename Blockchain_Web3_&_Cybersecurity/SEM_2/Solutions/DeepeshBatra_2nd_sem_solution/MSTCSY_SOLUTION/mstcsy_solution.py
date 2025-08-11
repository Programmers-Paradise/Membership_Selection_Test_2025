#i have used chatgpt and deepseek of understandable 
#code: both 
#documentation : chatgpt 
#the url is : https://chatgpt.com/share/68987777-f5f4-8012-9ebb-780ae27e95ce
#and https://chat.deepseek.com/a/chat/s/4fb68579-e74b-4290-ac9d-2646f64a1d14
#access on : August 10,2025

import csv 
# use to import csv file
from io import StringIO
#while working with a string input csv file , i  uses the StringIO import 
#to handle the CSV data as though it were coming from a file.
from typing import List
# We ensure that the function correctly processes lists of log strings and 
# returns lists of IP strings by using from typing import List to provide 
# explicit type hints (e.g., List[str]) for improved code clarity,
#  IDE support, and early bug detection.

def find_suspicious_ips(logs: List[str]) -> List[str]:

    #finds IP addresses that have more than five unsuccessful login attempts 
    # in a 10-minute (600-second) period.
    #Logs: List of log entries in the format "TIMESTAMP,IP_ADDRESS,STATUS"
    #Returns: An alphabetically arranged list of dubious IP addresses
    
    ip_failures = {}  # {ip: [sorted timestamps of failures]}
    suspicious_ips = set()
    
    for entry in logs:
        # if there is a header row, skip it.
        if entry.startswith("TIMESTAMP,IP_ADDRESS,STATUS"):
            continue
            
        # Parse the log entry
        try:
            parts = entry.split(',')
            if len(parts) != 3:
                continue  # Skip the malformed entries from log 
                
            timestamp_str, ip, status = parts
            timestamp = int(timestamp_str.strip())
            ip = ip.strip()
            status = status.strip().upper()
            
            # Reset the IP's failure history and handle the SUCCESS status.
            if status == "SUCCESS":
                if ip in ip_failures:
                    del ip_failures[ip]
                continue
                
            # Process  the fail status only and ignore others
            if status != "FAIL":
                continue
                
            # Initialize a new data structure for new IPs
            if ip not in ip_failures:
                ip_failures[ip] = []
                
            # Add if find current failure and maintain sorted order
            failures = ip_failures[ip]
            failures.append(timestamp)
            
            # If new timestamp is out of order then  sort it the list 
            if len(failures) > 1 and failures[-2] > failures[-1]:
                failures.sort()
            
            # Calculate the window boundaries
            window_start = timestamp - 600
            
            # Find first failure within current window using binary search
            left, right = 0, len(failures)
            while left < right:
                mid = (left + right) // 2
                if failures[mid] >= window_start:
                    right = mid
                else:
                    left = mid + 1
            
            # Counting the  failures in which is in current window
            failures_in_window = len(failures) - left
            
            # Check if threshold exceeded or not 
            if failures_in_window > 5:
                suspicious_ips.add(ip)
                
        except (ValueError, AttributeError):
            continue  # Skip entries with have the invalid format
    
    return sorted(suspicious_ips)

def process_csv_file(csv_content: str) -> List[str]:
    """
    returns questionable IPs after processing CSV data.
    
    Args: csv_content: A string with CSV data in it
        
    Returns: a list of dubious IP addresses
    """
    # Use StringIO to simulate a file object
    csv_file = StringIO(csv_content)
    reader = csv.reader(csv_file)
    
    # Converting  to list of strings in "TIMESTAMP,IP,STATUS" format
    logs = [','.join(row) for row in reader]
    
    return find_suspicious_ips(logs)

# Example usage with the provided CSV data which you have given 
csv_data = """TIMESTAMP,IP_ADDRESS,STATUS
1723005000,192.168.1.10,FAIL
1723005010,192.168.1.10,FAIL
1723005025,192.168.1.10,SUCCESS
1723005100,198.51.100.12,FAIL
1723005200,198.51.100.12,FAIL
1723005350,198.51.100.12,FAIL
1723005500,198.51.100.12,FAIL
1723005650,198.51.100.12,FAIL
1723005800,198.51.100.12,FAIL
1723006000,203.0.113.55,FAIL
1723006015,203.0.113.55,FAIL
1723006030,203.0.113.55,FAIL
1723006045,203.0.113.55,FAIL
1723006060,203.0.113.55,FAIL
1723006075,203.0.113.55,FAIL
1723006100,10.0.0.42,FAIL
1723006105,10.0.0.42,FAIL
1723006110,10.0.0.42,FAIL
1723006115,10.0.0.42,FAIL
1723006120,10.0.0.42,SUCCESS
1723006200,10.0.0.42,FAIL
1723006205,10.0.0.42,FAIL
1723006210,10.0.0.42,FAIL
1723006215,10.0.0.42,FAIL
1723006220,10.0.0.42,FAIL
1723006225,10.0.0.42,FAIL
1723006800,203.0.113.55,SUCCESS"""

if __name__ == "__main__":
    suspicious_ips = process_csv_file(csv_data)
    print("Suspicious IP addresses detected:")
    for ip in suspicious_ips:
        print(f"- {ip}")