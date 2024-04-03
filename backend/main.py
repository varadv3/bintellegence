import os
from unittest.mock import Base
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from database import get_database_connection

app = FastAPI()
conn = get_database_connection()
cur = conn.cursor()

class Admin(BaseModel):
    username: str
    password: str

@app.post("/admin")
async def admin(admin: Admin):
    if admin.username == os.getenv("ADMIN_USERNAME") and admin.password == os.getenv("ADMIN_PASSWORD"):
        return {"message" : "Admin logged in Successfully"}
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