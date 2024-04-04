from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import get_database_connection

app = FastAPI()
conn = get_database_connection()
cur = conn.cursor()

# Allow all origins (not recommended for production, you can restrict it to specific origins)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # This will allow all origins, you can specify your frontend URL instead
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

class Admin(BaseModel):
    username: str
    password: str

@app.post("/admin")
async def admin(admin: Admin):
    if admin.username == os.getenv("ADMIN_USERNAME") and admin.password == os.getenv("ADMIN_PASSWORD"):
        return {"message": "Admin logged in Successfully"}
    return HTTPException(status_code=400, detail="Wrong Username or Password")

@app.get("/status")
async def status():
    cur.execute("""
        SELECT * FROM organisation;
    """)
    data = list()
    for row in cur.fetchall():
        
        org_detail = {}
        org_detail["org_name"] = row[1]
        org_detail["filled_dry_bins"] = row[2]
        org_detail["tot_dry_bins"] = row[3]
        org_detail["filled_wet_bins"] = row[4]
        org_detail["tot_wet_bins"] = row[5]
        org_detail["zone"] = row[6]
        org_contact_no = row[7]
        cur.execute("""
            SELECT name, email from org_representative
            WHERE contact_no = '1234567890';
        """)
        org_detail["org_repr_detail"] = {}
        for repr_row in cur.fetchone():
            org_detail["org_repr_detail"]["name"] = repr_row[0]
            org_detail["org_repr_detail"]["email"] = repr_row[1]
            org_detail["org_repr_detail"]["contact_no"] = org_contact_no
        data.append(org_detail)
    if(len(data) == 0):
        return HTTPException(status_code=400, detail="Data not found")
    return data



@app.post("/increment-wet-bins")
async def increment_wet_bins(org_name: str):
    try:
        # Example SQL query to increment filled wet bins count
        cur.execute("UPDATE organisation SET filled_wet_bins = filled_wet_bins + 1 WHERE org_name = %s", (org_name,))
        conn.commit()
        return {"message": f"Wet bins for organization {org_name} incremented successfully"}
    except Exception as e:
        # Handle any errors that occur during database operation
        return HTTPException(status_code=500, detail=f"Error incrementing wet bins: {str(e)}")



@app.post("/reset-bins")
async def reset_bins():
    # Implement logic to reset the counts of all bins in your database
    # Example: Set the counts of dry and wet bins to 0
    # Update your database accordingly
    # Return a success message or appropriate response
    return {"message": "Bins reset successfully"}
