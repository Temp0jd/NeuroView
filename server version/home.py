from flask import Flask, render_template, request, jsonify, Response
import mariadb
import csv
import io

app = Flask(__name__, template_folder='templates', static_folder='static')

# Database config
db_config = {
    "user": "",
    "password": "",
    "host": "",
    "port": ,
    "database": ""
}

def get_db_connection():
    conn = mariadb.connect(**db_config)
    return conn

# ---------------- 页面 Routes ----------------

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/studies')
def studies():
    return render_template('studies.html')

@app.route('/portrait')
def portrait():
    return render_template('portrait.html')

@app.route('/viewer')
def data_viewer():
    return render_template('viewer.html')

@app.route('/help')
def help_page():
    return render_template('help.html')

# ---------------- API Routes ----------------

# 1. 拉全部 studies
@app.route('/api/get_studies', methods=['GET'])
def get_studies():
    try:
        conn = get_db_connection()
        cur  = conn.cursor(dictionary=True)

        query = """
             SELECT  Year_of_Publication, Journal, Title, Publication_Link, Summary, Focus,
              Dataset_Link, Sample_Number, Lifestage, Seq_Type, Species,
              GROUP_CONCAT(DISTINCT Region.Name      SEPARATOR ', ') AS Region,
              GROUP_CONCAT(DISTINCT Subregion.Name   SEPARATOR ', ') AS Subregion
              FROM    Publication
              JOIN    Publication_Dataset USING (PID)
              JOIN    Dataset             USING (DID)
              JOIN    Dataset_Region      USING (DID)
              JOIN    Region              USING (RID)
              LEFT   JOIN Subregion       USING (RID)
              WHERE   1 = 1
        """
        query += """
        GROUP BY Year_of_Publication, Journal, Title, Publication_Link,
                 Summary, Focus, Dataset_Link, Sample_Number, Lifestage,
                 Seq_Type, Species
        """
        
        cur.execute(query)
        rows = cur.fetchall()
        conn.close()
        return jsonify(rows)             # 正常返回
    except Exception as e:
        # ① 记录到服务器日志
        app.logger.exception("get_studies failed")
        # ② 同时把异常文本返给前端，方便调试
        return jsonify({"error": str(e)}), 500


# 2. 筛选 studies（根据前端条件）
@app.route('/api/filter_studies', methods=['POST'])
def filter_studies():
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)

    selected_focus = request.json.get('focus')
    selected_species = request.json.get('species')
    selected_seqtype = request.json.get('seqtype')
    selected_region = request.json.get('region')
    selected_journal = request.json.get('journal')
    selected_year = request.json.get('year')
    selected_search  = request.json.get('search') 

    query = """
        SELECT  Year_of_Publication, Journal, Title, Publication_Link, Summary, Focus,
        Dataset_Link, Sample_Number, Lifestage, Seq_Type, Species,
        GROUP_CONCAT(DISTINCT Region.Name      SEPARATOR ', ') AS Region,
        GROUP_CONCAT(DISTINCT Subregion.Name   SEPARATOR ', ') AS Subregion
        FROM    Publication
        JOIN    Publication_Dataset USING (PID)
        JOIN    Dataset             USING (DID)
        JOIN    Dataset_Region      USING (DID)
        JOIN    Region              USING (RID)
        LEFT   JOIN Subregion       USING (RID)
        WHERE   1 = 1
    """

    params = []

    if selected_focus:
        query += " AND Focus LIKE ?"
        params.append(f"%{selected_focus}%")
    if selected_species:
        query += " AND Species LIKE ?"
        params.append(f"%{selected_species}%")
    if selected_seqtype:
        query += " AND Seq_Type LIKE ?"
        params.append(f"%{selected_seqtype}%")
    if selected_region:
        query += " AND (Region.Name LIKE ? OR Subregion.Name LIKE ?)"
        params.extend([f"%{selected_region}%", f"%{selected_region}%"])
    if selected_journal:
        query += " AND Journal LIKE ?"
        params.append(f"%{selected_journal}%")
    if selected_year:
        query += " AND Year_of_Publication = ?"
        params.append(selected_year)
    if selected_search:                                   
        query += " AND (Title LIKE ? OR Summary LIKE ?)"
        like = f"%{selected_search}%"                    
        params.extend([like, like]) 
        
    query += """
        GROUP BY Year_of_Publication, Journal, Title, Publication_Link,
                 Summary, Focus, Dataset_Link, Sample_Number, Lifestage,
                 Seq_Type, Species
    """

    cur.execute(query, params)
    studies_data = cur.fetchall()
    conn.close()

    return jsonify(studies_data)

# 3. Portrait 气泡专用筛选
@app.route('/api/portrait_studies', methods=['POST'])
def portrait_studies():
    region_name = request.json.get('region')
    conn = get_db_connection()
    cur  = conn.cursor(dictionary=True)

    query = """
        SELECT  Year_of_Publication, Journal, Title, Publication_Link, Summary, Focus,
                Dataset_Link, Sample_Number, Lifestage, Seq_Type, Species,
                GROUP_CONCAT(DISTINCT Region.Name    SEPARATOR ', ') AS Region,
                GROUP_CONCAT(DISTINCT Subregion.Name SEPARATOR ', ') AS Subregion
        FROM    Publication
        JOIN    Publication_Dataset USING (PID)
        JOIN    Dataset             USING (DID)
        JOIN    Dataset_Region      USING (DID)
        JOIN    Region              USING (RID)
        LEFT   JOIN Subregion       USING (RID)
        WHERE   (Region.Name    LIKE ? OR        
                 Subregion.Name LIKE ?)
        GROUP BY
                Year_of_Publication, Journal, Title, Publication_Link,
                Summary, Focus, Dataset_Link, Sample_Number, Lifestage,
                Seq_Type, Species
    """

    like = f"%{region_name}%"
    cur.execute(query, (like, like))    
    studies = cur.fetchall()
    conn.close()
    return jsonify(studies)


# 4. 下载当前筛选结果 CSV
@app.route('/api/download_csv', methods=['GET'])
def download_csv():
    selected_focus = request.args.get('focus')
    selected_species = request.args.get('species')
    selected_seqtype = request.args.get('seqtype')
    selected_region = request.args.get('region')
    selected_journal = request.args.get('journal')
    selected_year = request.args.get('year')
    selected_search  = request.args.get('search')

    conn = get_db_connection()
    cur = conn.cursor()

    query = """
        SELECT  Year_of_Publication, Journal, Title, Publication_Link, Summary, Focus,
        Dataset_Link, Sample_Number, Lifestage, Seq_Type, Species,
        GROUP_CONCAT(DISTINCT Region.Name      SEPARATOR ', ') AS Region,
        GROUP_CONCAT(DISTINCT Subregion.Name   SEPARATOR ', ') AS Subregion
        FROM    Publication
        JOIN    Publication_Dataset USING (PID)
        JOIN    Dataset             USING (DID)
        JOIN    Dataset_Region      USING (DID)
        JOIN    Region              USING (RID)
        LEFT   JOIN Subregion       USING (RID)
        WHERE   1 = 1 
    """

    params = []

    if selected_focus:
        query += " AND Focus LIKE ?"
        params.append(f"%{selected_focus}%")
    if selected_species:
        query += " AND Species LIKE ?"
        params.append(f"%{selected_species}%")
    if selected_seqtype:
        query += " AND Seq_Type LIKE ?"
        params.append(f"%{selected_seqtype}%")
    if selected_region:
        query += " AND (Region.Name LIKE ? OR Subregion.Name LIKE ?)"
        params.extend([f"%{selected_region}%", f"%{selected_region}%"])
    if selected_journal:
        query += " AND Journal LIKE ?"
        params.append(f"%{selected_journal}%")
    if selected_year:
        query += " AND Year_of_Publication = ?"
        params.append(selected_year)
    if selected_search:                                   
        query += " AND (Title LIKE ? OR Summary LIKE ?)" 
        like = f"%{selected_search}%"                    
        params.extend([like, like])   
        
    query += """
        GROUP BY Year_of_Publication, Journal, Title, Publication_Link,
                 Summary, Focus, Dataset_Link, Sample_Number, Lifestage,
                 Seq_Type, Species
    """

    cur.execute(query, params)
    studies = cur.fetchall()
    conn.close()

    output = io.StringIO()
    writer = csv.writer(output)

    header = ['Year_of_Publication', 'Journal', 'Title', 'Publication_Link',
              'Summary', 'Focus', 'Dataset_Link', 'Sample_Number', 'Lifestage',
              'Seq_Type', 'Species', 'Region', 'Subregion']
              
    writer.writerow(header)

    for row in studies:
        writer.writerow(row)

    response = Response(output.getvalue(),
                    mimetype="text/csv; charset=utf-8")
    response.headers["Content-Disposition"] = (
      "attachment; filename=filtered_studies.csv")
    return response

if __name__ == '__main__':
    app.run(debug=True)


