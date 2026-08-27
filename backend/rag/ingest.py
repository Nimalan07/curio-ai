import json
import sys
import os

# Adjust path to import core files
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.database import save_knowledge_chunk, clear_knowledge_chunks
from rag.embeddings import get_ollama_embedding

# Curated high-quality educational knowledge chunks for the target topics
KNOWLEDGE_DATA = {
    "photosynthesis": [
        "Photosynthesis is the biological process by which plants, algae, and some bacteria convert light energy into chemical energy, producing glucose and oxygen from carbon dioxide and water.",
        "The light-dependent reactions take place in the thylakoid membranes of chloroplasts. Chlorophyll absorbs sunlight and uses it to split water molecules, releasing oxygen and generating energy carrier molecules: ATP (adenosine triphosphate) and NADPH.",
        "The Calvin cycle (light-independent reactions) occurs in the stroma of chloroplasts. It uses the ATP and NADPH generated in the light-dependent stage to fix carbon dioxide into organic sugar molecules (glucose).",
        "Chlorophyll is the primary green pigment in chloroplasts that absorbs light energy, primarily in the blue and red wavelengths, while reflecting green light.",
        "Stomata are tiny pores on the undersides of leaves that regulate gas exchange, allowing carbon dioxide to enter for photosynthesis and oxygen/water vapor to exit the plant."
    ],
    "newton's laws": [
        "Newton's First Law of Motion (Law of Inertia) states that an object at rest will stay at rest, and an object in motion will continue in motion at a constant velocity, unless acted upon by a net external force.",
        "Newton's Second Law of Motion states that the acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass. Mathematically, Force equals mass times acceleration (F = ma).",
        "Newton's Third Law of Motion states that for every action, there is an equal and opposite reaction. This means that forces always occur in matched pairs: if object A exerts force on object B, B exerts an equal force in the opposite direction on A.",
        "Inertia is the inherent property of matter to resist any changes in its state of motion. Mass is a quantitative measure of an object's inertia.",
        "Momentum is the product of an object's mass and its velocity (p = mv). In the absence of external forces, the total momentum of a closed system is conserved."
    ],
    "machine learning": [
        "Machine Learning is a branch of artificial intelligence focused on building systems that learn from data, identify patterns, and make decisions or predictions with minimal human intervention.",
        "Supervised learning involves training a model on a labeled dataset, where each training example is paired with its correct output label, enabling the model to learn a mapping function from input to output.",
        "Unsupervised learning deals with unlabeled data. The goal is to find hidden structures, clusters, or patterns in the data without explicit guidance (e.g., K-means clustering, Principal Component Analysis).",
        "Neural Networks are computational models inspired by the human brain. They consist of layers of interconnected nodes (neurons) that process inputs, apply weights and activation functions, and produce outputs.",
        "Gradient descent is an optimization algorithm used to minimize a model's loss function. It iteratively adjusts the model's parameters (weights and biases) in the direction of the steepest descent of the loss."
    ],
    "data structures": [
        "An Array is a contiguous linear data structure that stores elements of the same type, allowing constant-time O(1) random access to elements using an index.",
        "A Linked List consists of nodes where each node contains data and a pointer (or reference) to the next node. Elements are not stored in contiguous memory, making insertions and deletions O(1) but access O(N).",
        "Trees are hierarchical, non-linear structures consisting of nodes connected by edges. A Binary Search Tree (BST) maintains sorted order: elements smaller than the parent go left, larger elements go right.",
        "A Hash Table stores key-value pairs and uses a hash function to map keys to indexes in an array, offering average-time O(1) complexity for search, insert, and delete operations.",
        "Big O notation is a mathematical representation used to describe the asymptotic limiting behavior of an algorithm, measuring its time or space complexity as input size grows."
    ],
    "world war ii": [
        "The Axis powers of World War II were coalition partners led by Nazi Germany, fascist Italy, and the Empire of Japan, united by goals of territorial expansion and opposition to the Allied powers.",
        "The Allied powers were a global coalition led by Great Britain, the United States, the Soviet Union, and China, united in their goal to defeat the Axis alliance.",
        "The Treaty of Versailles, signed at the end of World War I, imposed heavy reparations, territorial losses, and military restrictions on Germany, creating economic hardship and resentment that contributed to the rise of Adolf Hitler.",
        "Pearl Harbor was a surprise military strike by the Imperial Japanese Navy Air Service upon the United States against the naval base at Pearl Harbor in Honolulu, Hawaii, on December 7, 1941, leading directly to the US entry into WWII.",
        "The D-Day landings (Operation Overlord) on June 6, 1944, saw Allied forces invade Nazi-occupied Normandy, France, opening a major Western Front and marking a turning point in the European theater."
    ]
}

def run_ingestion():
    print("Clearing old knowledge base...")
    clear_knowledge_chunks()
    
    total = 0
    for topic, chunks in KNOWLEDGE_DATA.items():
        print(f"Ingesting topic: {topic}...")
        for chunk in chunks:
            # Attempt to fetch embedding from Ollama
            emb = get_ollama_embedding(chunk)
            emb_json = json.dumps(emb) if emb else None
            
            save_knowledge_chunk(topic, chunk, emb_json)
            total += 1
            
    print(f"Success! Ingested {total} knowledge chunks into SQLite database.")

if __name__ == "__main__":
    run_ingestion()
