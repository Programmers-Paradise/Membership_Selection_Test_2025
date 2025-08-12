import pandas as pd
from datetime import datetime

def find_suspicious_ips(csv_file):
    """
    Analyzes log entries to identify suspicious IP addresses using pandas.
    
    Args:
        csv_file (str): Path to CSV file with columns TIMESTAMP,IP_ADDRESS,STATUS
    
    Returns:
        set: Set of suspicious IP addresses
    """
    # Read CSV and convert timestamp
    df = pd.read_csv(csv_file)
    df['TIMESTAMP'] = pd.to_datetime(df['TIMESTAMP'], unit='s')
    df = df.sort_values(['IP_ADDRESS', 'TIMESTAMP'])
    
    suspicious_ips = set()
    
    for ip in df['IP_ADDRESS'].unique():
        ip_data = df[df['IP_ADDRESS'] == ip].copy()
        ip_data = ip_data.reset_index(drop=True)
        
        # Reset failed attempts after each SUCCESS
        current_fails = []
        
        for idx, row in ip_data.iterrows():
            if row['STATUS'] == 'SUCCESS':
                current_fails = []  # Reset on success
            elif row['STATUS'] == 'FAIL':
                current_fails.append(row['TIMESTAMP'])
                
                # Check if >5 fails within 10-minute window
                if len(current_fails) > 5:
                    # Check if earliest fail is within 600 seconds of latest
                    time_window = (current_fails[-1] - current_fails[0]).total_seconds()
                    if time_window <= 600:
                        suspicious_ips.add(ip)
                        
                    # Also check sliding window for any 6 consecutive fails
                    for i in range(len(current_fails) - 5):
                        window_time = (current_fails[i+5] - current_fails[i]).total_seconds()
                        if window_time <= 600:
                            suspicious_ips.add(ip)
    
    return suspicious_ips

# Test with the provided data
if __name__ == "__main__":
    # Create test CSV from the provided data
    test_data = """TIMESTAMP,IP_ADDRESS,STATUS
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
    
    # Save test data to CSV
    with open('Log_data.csv', 'w') as f:
        f.write(test_data)
    
    # Run analysis
    result = find_suspicious_ips('Log_data.csv')
    print(f"Suspicious IPs: {result}")
    
    # Manual verification:
    print("\nAnalysis:")
    print("- 192.168.1.10: 2 FAIL then SUCCESS -> Not suspicious")
    print("- 198.51.100.12: 6 FAIL over 700 seconds -> Not suspicious (>10min)")
    print("- 203.0.113.55: 6 FAIL in 75 seconds -> SUSPICIOUS")
    print("- 10.0.0.42: 4 FAIL, SUCCESS (reset), then 6 FAIL in 25 seconds -> SUSPICIOUS")