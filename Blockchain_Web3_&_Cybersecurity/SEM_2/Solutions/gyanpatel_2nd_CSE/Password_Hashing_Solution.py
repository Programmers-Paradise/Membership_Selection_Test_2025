import pandas as pd
from collections import defaultdict
log_file_path = r"D:\Cybers\Log_data.csv"
df = pd.read_csv(log_file_path)
def find_suspicious_ips(logs_df):
    # stores thr failure timestamps 
    ip_failures = defaultdict(list)  
    suspicious_ips = set()
    WINDOW = 600  
    THRESHOLD = 6
    for _, row in logs_df.iterrows():
        timestamp = int(row["TIMESTAMP"])
        ip = row["IP_ADDRESS"].strip()
        status = row["STATUS"].strip().upper()
        if status == "SUCCESS":
            ip_failures[ip].clear()
        elif status == "FAIL":
            ip_failures[ip].append(timestamp)
            # Keeps failures of  the last 10 minutes
            ip_failures[ip] = [t for t in ip_failures[ip] if timestamp - t <= WINDOW]
            # If more than 6 failures in the window, marking as suspicious
            if len(ip_failures[ip]) > THRESHOLD:
                suspicious_ips.add(ip)
    return list(suspicious_ip)
suspicious_ips_list = find_suspicious_ips(df)
print(suspicious_ips_list)
