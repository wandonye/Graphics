function linkage(ctx, color, length) {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.moveTo(0,0);
  ctx.lineTo(4,2);
  ctx.lineTo(length-4,2);
  ctx.lineTo(length,0);
  ctx.lineTo(length-4,-2);
  ctx.lineTo(4,-2);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath()
  ctx.fillStyle = color;
  ctx.arc(0, 0, 4, 0, 2*Math.PI, false);
  ctx.fill();
}

function drawStage(ctx, status, stageLen, linkageLen, color) {
  ctx.save();
  ctx.rotate(status);
  linkage(ctx, color,linkageLen);

  ctx.restore();
  ctx.translate(linkageLen*Math.cos(status),linkageLen*Math.sin(status))
  ctx.beginPath();
  ctx.moveTo(-stageLen/2,0);
  ctx.lineTo(stageLen/2,0);
  ctx.lineWidth=2;
  ctx.strokeStyle=color;
  ctx.stroke();
}

function drawBiStage(ctx, status1, status2, stageLen, linkage1Len, linkage2Len, color) {
  ctx.save();
  ctx.rotate(status1);
  linkage(ctx, color,linkage1Len);
  ctx.restore();
  ctx.translate(linkage1Len*Math.cos(status1),linkage1Len*Math.sin(status1))
  drawStage(ctx, status2, stageLen, linkage2Len, color)
}

function drawStickMan(ctx, status) {
    ctx.lineWidth=1;
    ctx.strokeStyle="black";
    // body
    ctx.beginPath();
    ctx.moveTo(0,-8);
    ctx.lineTo(0,-16);
    ctx.stroke();
    //head
    ctx.beginPath()
    ctx.fillStyle="#fff"
    ctx.arc(0, -20, 4, 0, 2*Math.PI, false);
    ctx.fill()
    ctx.stroke()

    angle = status + Math.PI;
    //arms
    ctx.save();
    ctx.translate(0,-16);
    ctx.save();
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(0,-9);
    ctx.stroke();
    ctx.restore();
    ctx.rotate(-angle);
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(0,-9);
    ctx.stroke();
    //legs
    ctx.restore();
    ctx.translate(0,-8);
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(10*status,8);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(-10*status,8);
    ctx.stroke();
}
