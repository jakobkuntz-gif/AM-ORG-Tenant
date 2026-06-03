const fs = require("fs");
const indexPath = "index.html";
let html = fs.readFileSync(indexPath, "utf8");
const panel = fs.readFileSync("stats-performance-panel.fragment.html", "utf8");

// Remove broken external panel
const brokenStart = html.indexOf("\n\n<div id=\"statsPanelPerformance\"");
const brokenEnd = html.indexOf("        <input\n          id=\"profileUploadInput\"", brokenStart);
if (brokenStart === -1 || brokenEnd === -1) throw new Error("broken panel not found");
html = html.slice(0, brokenStart) + "\n" + html.slice(brokenEnd);

// Insert inside stats-shell before it closes
const anchor = `                  <div class="stat-eval-box stat-eval-box--location">
                    <h3>Anfragen je Standort</h3>
                    <div class="stat-eval-box-body"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>`;

const replacement = `                  <div class="stat-eval-box stat-eval-box--location">
                    <h3>Anfragen je Standort</h3>
                    <div class="stat-eval-box-body"></div>
                  </div>
                </div>
              </div>
            </div>

${panel}
          </div>
        </section>`;

if (!html.includes(anchor)) throw new Error("anchor not found");
html = html.replace(anchor, replacement);

fs.writeFileSync(indexPath, html);
console.log("Panel fixed, lines", html.split("\n").length);
