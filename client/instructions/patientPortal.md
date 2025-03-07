Patient Portal

Analysis

-----------------------------
1. Analysis Idea Updates Future
-----------------------------

* Be able to easily select buttons to export data based on what kind of analysis you want to do
* Calculations about how many of each survey 'complete' as well as counts of how many people are at what point
* Retention - At what point is a survey considered "late" can run calculations based on 
* Create functions to identify data that is error / needs to be chekced / can be fixed in other surveys and updated

Sandy 11/22 email
* Fix date format of DOB, and registration date to MM/DD/YYYY
* Create an age formula

-----------------------------
2. Data Merge, Clean and/or Rules
-----------------------------

1. What automated metrics are you interested in having?
    [] Monthly completion % ?  
    [] Monthly Counts of surveys completed     
    [] Counts of certain variables (ie are certain demographics represented, certain populations, certain types of kidney disease, etc)

2. Comorbidities is not a specific question? (did you mean like you want every single cause variable cancer, hyptertention, diabetes, transplants, cardiovascular etc etc )
    []

3. Structure of combo dataset updates
    [] Tab 1: The combodataset
    [] Tab 2: Demographics (the tables of stats Sandy wanted)
    [] Tab 3: Dashboard (This will be the tables of the stats that are more so related to retention/completion etc)

    [] Tab2.5: If Sandy wants to look at the Demographics to be filtered by certain variables, it replicates the tables but filters based on the specific variable(s)

4. Updates to "Tab 2" Tables
    [] Add % for the counts
    [] Each table should be sorted by highest to lowest %
    [] Add a 'total' category for each table so can see what the cateogry N is (maybe instead of total row create it to dynamically next to the title with (N=23)) etc
    [] for the kidney counts use c_organsTrasnplant and only kidney
    [] For null answers (or just each table) may have to use other questiosn for like y/n so that nulls are not included becasue those are people that didnt get shownt the ?
    [] Bold the Title if possible for the 'table title'

5. Updates to "Tab 1" combodataset
    [] Add KDQOL / EQ5D5L Scores


-----------------------------
3. Extra
-----------------------------

- Data Rule Chance Guide that I made (is format correct / columns)

- Send top 50 list (non-lab value variables) of all 'changed variables' to review for rules
    * Meeting with Sandy (include the counts of how often the 'change' is happening) and include rule change logic

Current Combo Versions:
1. Raw No Rule, Combo Data
2. Combo Data, with rules cleaned up
3. Combo Data but just one core survey that uses all of the rules so it represents 'baseline demographics'
    - core survey questions that are supposed to change pulled out and similar to eq5d5l will be 'lab values'

4. CREATE also a dataset that can be used for the interactive dashboard built

* Map + Charts/stats will be available next week if you need another up to date dataset by like Friday
    - detailed information -> cause of ckd
    - demographics (race/ethnicity, gender)

