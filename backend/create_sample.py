import pandas as pd

df = pd.read_csv("/Users/shanmukanandini/Downloads/archive/Reviews.csv")

sample_df = df.sample(n=5000, random_state=42)

sample_df.to_csv("amazon_reviews_5k.csv", index=False)

print("Created amazon_reviews_5k.csv")