#!/usr/local/bin/perl
use JSON;
use Cwd;
use WebCNP::Config;
use WWW::Auth;
use WWW::Auth::DB;
require 'webcnp_lib.pl';
use Encode;
use strict;
use warnings;
=pod

=head1 DESCRIPTION
This module handles Z Score CRUD. The code herein is for creating, reading, updating and deleting surveys. It functions as both model and controller. All viewing functions will be handled by the views themselves. In a way, the hope is to move towards an MVC architecture.
All other modules will be left as they are unless we are given permission to refactor them as well.

=cut

my ($cgi, $CONFIG, $DEBUG, $template, $datetime, $db, $server_type, $server_name) = &init_webcnp('tests.pl');


my $dbh = $db->{_dbh};

my %vars = (
    CONFIG => $CONFIG,
    server_type => $server_type,
    server_name => $server_name,
    server_url => $CONFIG->{server}->{url},
    script => 'http://localhost/tests.pl'
);

# only returns upon successful authentication
# Skip login for now.
#my ($adminid, $http_header_hashref) = check_login($cgi, \%vars, 'zscores', $template, 'zscores.pl', $db);

my %invalid_request = ("status" => 400, "message" => "There was an error processing your request. Please try again later.");
my %invalid_upload_request = ("status" => 400, "message" => "There was an error uploading the file. Please check your input and try again.");
my %success_request = ("status" => 400, "message" => "Content was updated successfully.");
my $raw_data = $cgi->param('POSTDATA');

if($cgi->param('file'))
{
  print STDERR "FIle is " . $cgi->param('file') . " and data is  " . $cgi->param('file_data') . "\n";
  my @file_lines = ();
  print STDERR join("----", @file_lines);
  my $file = $cgi->upload('file');
  my $action = $cgi->param("op");
  print STDERR "Action is $action\n";
  if($action eq "upload_timeline")
  {
    while(<$file>)
    {
      my $line = $_;
      $line =~ s/\n//;
      if(!$line =~ /^\s*$/)
      {
        push @file_lines, $line;
      }
    }
    close($file);

    # Process given file contents and get ready to insert into database.
    save_test_version_timeline(\@file_lines);
    print $cgi->header('application/json');
    print JSON::XS->new->encode(\%invalid_request);
    exit;
  }
  elsif($action eq "upload_trials")
  {
    my $json_text = "";
    while(<$file>)
    {
      my $line = $_;
      $line =~ s/\n//;
      $json_text = $json_text . $line;
    }
    close($file);

    print STDERR "Found JSON text " . $json_text . "\n";
    my $json = JSON->new;
    my $data = $json->decode($json_text);
    my @trials = @{$data->{trials}};
    if(!@trials || scalar @trials < 1)
    {
      on_error(\%invalid_request);
    }
    my $test_version_id = $cgi->param("id");
    for my $trial(@trials)
    {
      #print STDERR "Need to save trial " . $trial . "\n";
      save_test_version_trials($test_version_id, $trial);
    }
    print $cgi->header('application/json');
    print JSON::XS->new->encode(\%invalid_request);
    exit;
  }
  else{
    print STDERR "Invalid action $action\n";
    print $cgi->header('application/json');
    print JSON::XS->new->encode(\%invalid_request);
    exit;
  }
}
elsif(!$raw_data)
{
  print STDERR "No post data and no file upload, exiting.";
  print $cgi->header('application/json');
  print JSON::XS->new->encode(\%invalid_request);
  exit;
}
else
{
  print STDERR "Data be " . $raw_data . "\n";
  my $data = decode_json($raw_data);
  print STDERR "Data ke " . $data;

  my $action = $data->{op};

  if($action eq "vtv")
  {
    my @test_versions = @{get_test_versions()};
    my %test_info = (
       test_versions_data => \@test_versions
    );
    print $cgi->header('application/json');
    print JSON::XS->new->encode(\%test_info);
    exit;
  }
  elsif($action eq "gtv")
  {
    my $id = $data->{id};
    my $test_version = get_test_version($id);
    my %test_info = (
       test_version_data => $test_version
    );
    print $cgi->header('application/json');
    print JSON::XS->new->encode(\%test_info);
    exit;
  }
  elsif($action eq "save")
  {
    my $short_name = $data->{short_name};
    my $title = $data->{title};
    my $test_form = $data->{form};
    my $version_major = $data->{version_major};
    my $version_minor = $data->{version_minor};

    my $test = save_test_version($short_name, $title, $version_major, $version_minor, $test_form);
    my %test_info = (
       test => $test
    );
    print $cgi->header('application/json');
    print JSON::XS->new->encode(\%test_info);
    exit;
  }
  elsif($action eq "update")
  {
    my $id = $data->{id};
    my $short_name = $data->{short_name};
    my $title = $data->{title};
    my $test_form = $data->{form};
    my $version_major = $data->{version_major};
    my $version_minor = $data->{version_minor};
    update_test_version($id, $short_name, $title, $version_major, $version_minor, $test_form);
  }
  elsif($action eq "timeline")
  {
    my $id = $data->{id};
    my $lang = $data->{language} || "en_US";
    my $timeline = get_test_version_timeline($id, $lang);
    my %test_info = (
       timeline => $timeline
    );
    print $cgi->header('application/json');
    print JSON::XS->new->encode(\%test_info);
    exit;
  }
  elsif($action eq "view_tests")
  {
    my $id = $data->{id};
    print STDERR "Action is view tests, so viewing for test_version_id $id ...\n";
    my $tests = get_test_version_tests($id);
    #my $trials = get_test_version_trials($id);
    my %test_info = (
       tests => $tests
    );

    print $cgi->header('application/json');
    print JSON::XS->new->encode(\%test_info);
    exit;
  }
  elsif($action eq "view_possible_tests")
  {
    my $short_name = $data->{short_name};
    print STDERR "Action is view tests, so viewing for test_version_id $short_name ...\n";
    my $tests = get_possible_test_version_tests($short_name);
    #my $trials = get_test_version_trials($id);
    my %test_info = (
       tests => $tests
    );

    print $cgi->header('application/json');
    print JSON::XS->new->encode(\%test_info);
    exit;
  }
  elsif($action eq "remove_test_version_test")
  {
    my $test = $data->{test};
    print STDERR "Action is remove_test_version_test, so removing $test ...\n";
    my $message = remove_test_version_test($test);
    #my $trials = get_test_version_trials($id);
    my %test_info = (
       message => $message
    );

    print $cgi->header('application/json');
    print JSON::XS->new->encode(\%test_info);
    exit;
  }
  elsif($action eq "view_trials")
  {
    print STDERR "Action is view trials, so viewing ...\n";
    my $id = $data->{id};
    my $practice_trials = get_test_version_trials($id, "practice");
    my $test_trials = get_test_version_trials($id, "test");
    my $slide_trials = get_test_version_trials($id, "slideshow");
    my @trials = (@{$practice_trials}, @{$test_trials}, @{$slide_trials});
    #my $trials = get_test_version_trials($id);
    my %test_info = (
       trials => \@trials
    );

    print $cgi->header('application/json');
    print JSON::XS->new->encode(\%test_info);
    exit;
  }
  elsif($action eq "administer")
  {
    # We will be able to get the current battery, admin id etc from the cookies.
    # For now we hardcode and default to motor praxis.

    # Need to get the current test to administer.

    # select a.lang from batteries as a inner join batteries2tests as b on a.battery = b.battery and b.test = "zh_CN-mpraxis-2.06"

    my $language = $data->{language};
    if(!$language)
    {
      $language = "en_US";
    }
    my $test_name = $data->{test};
    print STDERR "Looking for test $test_name \n";
    if(!$test_name)
    {
      #$test_name = "mpraxis-2.06-ff";
      on_error(\%invalid_request);
    }
    my $test = get_test($test_name);
    my $test_version_id = $test->{parent_test};
    if(!$test_version_id)
    {
      print STDERR "Test version not found for test $test_name \n";
      on_error(\%invalid_request);
    }
    my $timeline;
    my $practice_trials;
    my $test_trials;
    my $slideshow;

    #if($language)
    #{
      $timeline = get_test_version_timeline($test_version_id, $language);
    #}
    $practice_trials = get_test_version_trials($test_version_id, "practice");
    $test_trials = get_test_version_trials($test_version_id, "test");
    $slideshow = get_test_version_trials($test_version_id, "slideshow");

    my %test_info = (
       test => $test,
       timeline => $timeline,
       practice_trials => $practice_trials,
       test_trials => $test_trials,
       slideshow => $slideshow
    );

    print $cgi->header('application/json');
    print JSON::XS->new->encode(\%test_info);
    exit;
  }
  else
  {
    on_error(\%invalid_request);
  }
}


sub save_test_document
{
  my $title = shift;
  my $test_version_id = shift;
  my $section_number = shift;
  my $stmt = "INSERT INTO test_documents(title, test_version_id, section_number) VALUES(?, ?, ?)";
  my @variable_bindings = ($title, $test_version_id, $section_number);

  my $query = $dbh->prepare($stmt);
  if($query->errstr())
  {
      print STDERR "DB error during prepare statement ".$query->errstr()."\n";
      on_error(\%invalid_request);
  }

  $query->execute(@variable_bindings);
  if($query->errstr())
  {
      print STDERR "DB error during execute statement ".$query->errstr()."\n";
      on_error(\%invalid_request);
  }

  $query->finish;
  #$dbh->commit;

  #my $document_id =  $dbh->mysql_insertid;
  return get_test_document($title, $test_version_id, $section_number);
}

sub save_test_version
{
  my ($short_name, $title, $version_major, $version_minor, $test_form) = @_;

  my $stmt = "INSERT INTO test_versions(short_name, title, version_major, version_minor, test_form) VALUES(?, ?, ?, ?, ?)";
  my @variable_bindings = ($short_name, $title, $version_major, $version_minor, $test_form);

  my $query = $dbh->prepare($stmt);
  if($query->errstr())
  {
      print STDERR "DB error during prepare statement ".$query->errstr()."\n";
      on_error(\%invalid_request);
  }

  $query->execute(@variable_bindings);
  if($query->errstr())
  {
      print STDERR "DB error during execute statement ".$query->errstr()."\n";
      on_error(\%invalid_request);
  }

  $query->finish;
  #$dbh->commit;

  #my $document_id =  $dbh->mysql_insertid;
  #my $id = $dbh->mysql_insertid();
  print STDERR "Successfully inserted $short_name, $title, $version_major, $version_minor, $test_form\n";
  return get_test_version_by_title_version($short_name, $version_major, $version_minor);
}

sub update_test_version
{
  my ($id, $short_name, $title, $version_major, $version_minor, $test_form) = @_;

  my $stmt = "UPDATE test_versions SET short_name = ?, title = ?, version_major = ?, version_minor = ?, test_form = ? WHERE id = ?";
  my @variable_bindings = ($short_name, $title, $version_major, $version_minor, $test_form, $id);

  my $query = $dbh->prepare($stmt);
  if($query->errstr())
  {
      print STDERR "DB error during prepare statement ".$query->errstr()."\n";
      on_error(\%invalid_request);
  }

  $query->execute(@variable_bindings);
  if($query->errstr())
  {
      print STDERR "DB error during execute statement ".$query->errstr()."\n";
      on_error(\%invalid_request);
  }

  $query->finish;
  return $id;
}

sub save_test_version_trials
{
  my $test_version_id = shift;
  my $trial = shift;
  my $stmt = "INSERT INTO test_trials(test_version_id, question_number, stimulus, responses, trial_type, correct_response, trial_section) VALUES(?, ?, ?, ?, ?, ?, ?)";
  my @variable_bindings = ($test_version_id, $trial->{question_number}, decode('utf-8', JSON::XS->new->encode($trial->{stimulus})), decode('utf-8', JSON::XS->new->encode($trial->{responses})), $trial->{trial_type}, $trial->{correct_response}, $trial->{trial_section});

  my $query = $dbh->prepare($stmt);
  if($query->errstr())
  {
      print STDERR "DB error during prepare statement ".$query->errstr()."\n";
      on_error(\%invalid_request);
  }

  $query->execute(@variable_bindings);
  if($query->errstr())
  {
      print STDERR "DB error during execute statement ".$query->errstr()."\n";
      on_error(\%invalid_request);
  }

  $query->finish;
}

sub get_possible_test_version_tests
{
  my $test_version_short_name = shift;
  print STDERR "get_possible_test_version_tests\n";
  my $stmt = "SELECT * FROM tests WHERE test LIKE ?";
  my @variable_bindings = ($test_version_short_name . "%");
  my $query = $dbh->prepare($stmt);
  if($query->errstr())
  {
      print STDERR "DB error during prepare statement ".$query->errstr()."\n";
  }

  $query->execute($test_version_short_name . '%');
  if($query->errstr())
  {
      print STDERR "DB error during execute statement ".$query->errstr()."\n";
  }
  my @tests = ();
  #my $section;
  while(my $test = $query->fetchrow_hashref)
  {
    print STDERR "Found like test " . $test->{test} . "\n";
    push(@tests, $test);
  }
  $query->finish;
  return \@tests;
}

sub remove_test_version_test
{
  my $test = shift;
  my $stmt = "UPDATE tests SET parent_test=NULL WHERE test = ?";
  my @variable_bindings = ($test);
  my $query = $dbh->prepare($stmt);
  if($query->errstr())
  {
      print STDERR "DB error during prepare statement ".$query->errstr()."\n";
      return "Error preparing query.";
  }

  $query->execute(@variable_bindings);
  if($query->errstr())
  {
      print STDERR "DB error during execute statement ".$query->errstr()."\n";
      return "Error executing query.";
  }
  $query->finish;
  return "Test removed successfully.";
}

sub get_test_version_tests
{
  my $test_version_id = shift;
  my $trial_type = shift;
  my $stmt = "SELECT * FROM tests WHERE parent_test = ? ORDER BY test, lang";
  my @variable_bindings = ($test_version_id);
  my $query = $dbh->prepare($stmt);
  if($query->errstr())
  {
      print STDERR "DB error during prepare statement ".$query->errstr()."\n";
  }

  $query->execute(@variable_bindings);
  if($query->errstr())
  {
      print STDERR "DB error during execute statement ".$query->errstr()."\n";
  }
  my @tests = ();
  #my $section;
  while(my $test = $query->fetchrow_hashref)
  {
    print STDERR "Found test " . $test->{test} . "\n";
    # Decode JSON content especially for non-latin languages that use different characters.
    #$trial->{stimulus} = decode('UTF-8', $trial->{stimulus});
    #$trial->{responses} = decode('UTF-8', $trial->{responses});
    push(@tests, $test);
  }
  $query->finish;
  return \@tests;
}

sub get_test_version_trials
{
  my $test_version_id = shift;
  my $trial_type = shift;
  my $stmt = "SELECT * FROM test_trials WHERE test_version_id = ? AND trial_type = ? ORDER BY trial_section, trial_type, question_number";
  my @variable_bindings = ($test_version_id, $trial_type);
  my $query = $dbh->prepare($stmt);
  if($query->errstr())
  {
      print STDERR "DB error during prepare statement ".$query->errstr()."\n";
  }

  $query->execute(@variable_bindings);
  if($query->errstr())
  {
      print STDERR "DB error during execute statement ".$query->errstr()."\n";
  }
  my @trials = ();
  #my $section;
  while(my $trial = $query->fetchrow_hashref)
  {
    print STDERR "Found trial " . $trial->{stimulus} . "\n";
    # Decode JSON content especially for non-latin languages that use different characters.
    #$trial->{stimulus} = decode('UTF-8', $trial->{stimulus});
    #$trial->{responses} = decode('UTF-8', $trial->{responses});
    push(@trials, $trial);
  }
  $query->finish;
  return \@trials;
}

sub save_test_version_timeline
{
  my $lines = shift;

  my @file_lines = @{$lines};
  my @content = ();
  my @sections = ();
  my $count = 0;
  my $section_number = 1;
  # Start with no section.
  my $section = undef;
  my ($test, $version, $language);
  my $title;
  my $prev_title;
  my $document_id;
  my $prev_document_id;
  my $test_version;
  for my $line(@file_lines)
  {
    if($count == 0)
    {
      my @x = split ':', $line;
      my $val = $x[1];
      $val =~ s/ //;
      $test = $val;
    }
    elsif($count == 1)
    {
      my @x = split ':', $line;
      my $val = $x[1];
      $val =~ s/ //;
      my @version_content = split '.', $val;
      $version = $version_content[0];
      $test_version = get_test_version_by_title_version($test, $version);
      print STDERR "Found test version " . $test_version->{title} . "\n";
    }
    elsif($count == 2)
    {
      my @x = split ':', $line;
      my $val = $x[1];
      $val =~ s/ //;
      $language = $val;
      if(!$test_version)
      {
        #on_error(\%invalid_upload_request);
      }
    }
    elsif($line =~ m/(^Page [0-9])/i)
    {
      if(scalar @content  > 0)
      {
        # Insert into database.
        # For now this only works for motor praxis.
        #my @sections = @{get_section_by_test_title_and_section_number(1, $title, $section_number)};
        print STDERR "Must save section with title $title and id " . $section->{id} . " plus content  ". join(", ", @content) . "\n";
        save_translation($section->{id}, "en_US", \@content);
        $title = $line;
        $title =~ s/ /_/g;
        @content = ();
        $section_number = $section_number + 1;
        $section = save_test_document($title, $test_version->{id}, $section_number);
        $document_id = $section->{id};
        $prev_document_id = $document_id;
        print STDERR "Given section $title and test $test and content " . join(", ", @content) . "\n";
      }
      else
      {
        $title = $line;
        $title =~ s/ /_/g;
        $section = save_test_document($title, $test_version->{id}, $section_number);
        if(!$section)
        {
          on_error(\%invalid_request);
        }
        $document_id = $section->{id};
        $prev_document_id = $document_id;
      }
      #$title =~ s/:/_/g;
    }
    else
    {
      push @content, $line;
    }
    $count++;
  }
  if($title && scalar @content > 0)
  {
    if($section)
    {
      print STDERR "Must save last section with title $title and id " . $section->{id} . " plus content  ". join(", ", @content) . "\n";
      save_translation($section->{id}, "en_US", \@content);
    }
  }
}


sub get_test_document
{
  my $title = shift;
  my $test_version_id = shift;
  my $section_number = shift;
  my $stmt = "SELECT * FROM test_documents WHERE title = ? and test_version_id = ? and section_number = ?";
  my @variable_bindings = ($title, $test_version_id, $section_number);

  my $query = $dbh->prepare($stmt);
  if($query->errstr())
  {
      print STDERR "DB error during prepare statement ".$query->errstr()."\n";
  }

  $query->execute(@variable_bindings);
  if($query->errstr())
  {
      print STDERR "DB error during execute statement ".$query->errstr()."\n";
  }

  return $query->fetchrow_hashref;
}

sub get_test_version
{
  my $id = shift;
  my $stmt = "SELECT * FROM test_versions WHERE id = ?";
  my @variable_bindings = ($id);

  my $query = $dbh->prepare($stmt);
  if($query->errstr())
  {
      print STDERR "DB error during prepare statement ".$query->errstr()."\n";
  }

  $query->execute(@variable_bindings);
  if($query->errstr())
  {
      print STDERR "DB error during execute statement ".$query->errstr()."\n";
  }

  return $query->fetchrow_hashref;
}

sub get_test_version_by_title_version
{
  my $test = shift;
  my $version_major = shift;
  my $version_minor = shift;
  my $stmt = "SELECT * FROM test_versions WHERE short_name = ?";

  my @variable_bindings = ($test);

  if($version_major)
  {
    $stmt = "SELECT * FROM test_versions WHERE short_name = ? AND version_major = ?";
    push(@variable_bindings, $version_major);
  }

  if($version_minor)
  {
    $stmt = "SELECT * FROM test_versions WHERE short_name = ? AND version_major = ? AND version_minor = ?";
    push(@variable_bindings, $version_minor);
  }

  my $query = $dbh->prepare($stmt);
  if($query->errstr())
  {
      print STDERR "DB error during prepare statement ".$query->errstr()."\n";
  }

  $query->execute(@variable_bindings);
  if($query->errstr())
  {
      print STDERR "DB error during execute statement ".$query->errstr()."\n";
  }

  return $query->fetchrow_hashref;
}

sub get_test_version_timeline
{
  my $id = shift;
  my $language = shift;

  my $stmt = "select test_documents.id as document_id, test_documents_text.id as text_id, test_documents.title as section_title, " .
  "test_documents.section_number as page_number, test_documents_text.content as content " .
  " from test_documents inner join test_documents_text on test_documents.id = test_documents_text.document_id and test_documents.test_version_id = ? and test_documents_text.language = ?";
  my @variable_bindings = ($id);

  if($language)
  {
    push(@variable_bindings, $language);
  }
  else
  {
    push(@variable_bindings, "en_US");
  }

  my $query = $dbh->prepare($stmt);
  if($query->errstr())
  {
      print STDERR "DB error during prepare statement ".$query->errstr()."\n";
  }

  $query->execute(@variable_bindings);
  my @test_versions = ();
  #my $section;
  while(my $test_version = $query->fetchrow_hashref)
  {
    # $translation->{content} = decode('UTF-8', $translation->{content});
    push(@test_versions, $test_version);
  }
  $query->finish;
  return \@test_versions;
}

sub get_test_versions
{
  my $stmt = "SELECT * FROM test_versions ORDER BY title, short_name, version_major, version_minor";
  my $query = $dbh->prepare($stmt);
  if($query->errstr())
  {
      print STDERR "DB error during prepare statement ".$query->errstr()."\n";
  }

  $query->execute;
  if($query->errstr())
  {
      print STDERR "DB error during execute statement ".$query->errstr()."\n";
  }
  my @test_versions = ();
  #my $section;
  while(my $test_version = $query->fetchrow_hashref)
  {
    push(@test_versions, $test_version);
  }
  $query->finish;
  return \@test_versions;
}


sub get_test
{
  my $test = shift;
  my $version = shift;
  my @variable_bindings = ($test);
  my $stmt = "SELECT * FROM tests WHERE test = ?";
  if($version)
  {
    my $stmt = "SELECT * FROM tests WHERE test = ? AND version_major = ?";
    push(@variable_bindings, $version);
  }



  my $query = $dbh->prepare($stmt);
  if($query->errstr())
  {
      print STDERR "DB error during prepare statement ".$query->errstr()."\n";
  }

  $query->execute(@variable_bindings);
  if($query->errstr())
  {
      print STDERR "DB error during execute statement ".$query->errstr()."\n";
  }

  return $query->fetchrow_hashref;
}

sub get_test_documents
{
  # Get all the sections for a given test.
  my $stmt = "SELECT * FROM test_documents ORDER BY section_number";
  my $query = $dbh->prepare($stmt);
  if($query->errstr())
  {
      print STDERR "DB error during prepare statement ".$query->errstr()."\n";
  }

  $query->execute;
  if($query->errstr())
  {
      print STDERR "DB error during execute statement ".$query->errstr()."\n";
  }
  my @sections = ();
  #my $section;
  while(my $section = $query->fetchrow_hashref)
  {
    print STDERR "Found session " . $section->{title} . "\n";
    push(@sections, $section);
  }
  $query->finish;
  return \@sections;
}


sub get_test_documents_text
{
  my $section = shift;
  # Get all the sections for a given test.
  my $stmt = "SELECT * FROM test_documents_text WHERE document_id = ?";
  my @variable_bindings = ();
  push(@variable_bindings, $section->{id});
  my $query = $dbh->prepare($stmt);
  my %result = ("type" => "Unkown");

  if($query->errstr())
  {
      print STDERR "DB error during prepare statement ".$query->errstr()."\n";
  }

  $query->execute(@variable_bindings);
  if($query->errstr())
  {
      print STDERR "DB error during execute statement ".$query->errstr()."\n";
  }
  my $section_text = $query->fetchrow_hashref;
  print STDERR "Section text is given by " . $section_text->{title} . " \n";

  if($section_text && $section->{title} eq "Instructions")
  {
    $result{"type"} = $section->{title};
    $result{'SimpleInstructions'} = $section_text->{content};
  }
  elsif($section_text && $section->{title} eq "Begin_Practice")
  {
    $result{"type"} = "Begin";
    $result{'content'} = $section_text->{content};
  }
  elsif($section_text && $section->{title} eq "Practice")
  {
    $result{"type"} = "Practice";
    $result{'additional_text'} = $section_text->{content};
  }
  elsif($section_text && $section->{title} eq "Begin_Test")
  {
    $result{"type"} = "Begin";
    $result{'content'} = $section_text->{content};
  }
  elsif($section_text && $section->{title} eq "Test")
  {
    $result{"type"} = "Test";
    $result{'additional_text'} = $section_text->{content};
  }
  else
  {
    die("Unknown section type " . $section->{"type"} . "\n");
  }
  return \%result;
}


sub save_translation
{
  my $document_id = shift;
  my $language = shift;
  my $content = shift;
  my $current_translations = view_translation();

  # Get all the sections for a given test.
  my $stmt = "INSERT INTO test_documents_text(content, document_id, language) VALUES(?, ?, ?)";

  if(scalar @$current_translations > 0)
  {
    $stmt = "UPDATE test_documents_text SET content = ? WHERE document_id = ? AND language = ?";
  }
  print STDERR "Statement be " . $stmt . " with values $document_id, $language, $content\n";
  my $query = $dbh->prepare($stmt);
  if($query->errstr())
  {
      print STDERR "DB error during prepare statement ".$query->errstr()."\n";
  }

  my @variable_bindings = (decode('utf-8', JSON::XS->new->encode($content)), $document_id, $language);

  $query->execute(@variable_bindings);
  if($query->errstr())
  {
      print STDERR "DB error during execute statement ".$query->errstr()."\n";
  }
  $query->finish;
  $dbh->commit;
}

sub view_translation
{
  my $document_id = shift;
  my $language = shift;
  my $stmt = "SELECT * FROM test_documents_text WHERE document_id = ? AND language = ?";
  my $query = $dbh->prepare($stmt);
  if($query->errstr())
  {
      print STDERR "DB error during prepare statement ".$query->errstr()."\n";
  }

  my @variable_bindings = ($document_id, $language);

  $query->execute(@variable_bindings);
  if($query->errstr())
  {
      print STDERR "DB error during execute statement ".$query->errstr()."\n";
  }
  my @translations = ();
  #my $section;
  while(my $translation = $query->fetchrow_hashref)
  {
    # Decode JSON content especially for non-latin languages that use different characters.
    $translation->{content} = decode('UTF-8', $translation->{content});
    print STDERR "Found session with content " . $translation->{content} . " \n";
    push(@translations, $translation);
  }
  $query->finish;
  return \@translations;

}

sub on_error
{
  my $error = shift;
  print $cgi->header('application/json');
  print JSON::XS->new->encode(\$error);
}
1;
